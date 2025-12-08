import { findUserByEmail, createUser, updateUser } from "../models/user.js";
import fetch from "node-fetch";

export function googleAuthRoutes(fastify) {
  fastify.get("/auth/google", async (request, reply) => {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent"
    });

    return reply.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
  });
  fastify.get("/auth/google/callback", async (request, reply) => {
    try {
      const code = request.query.code;
      if (!code) return reply.redirect(`https://localhost:8443/login`);

      const params = new URLSearchParams();
      params.append("code", code);
      params.append("client_id", process.env.GOOGLE_CLIENT_ID);
      params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET);
      params.append("redirect_uri", process.env.GOOGLE_CALLBACK_URL);
      params.append("grant_type", "authorization_code");

      const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString()
      });

      const tokenData = await tokenRes.json();

      if (!tokenData.access_token) {
        console.error(tokenData);
        return reply.code(400).send({ error: "Failed to get access token from Google" });
      }

      const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` }
      });

      const userInfo = await userRes.json();
      const email = userInfo.email;
      if (!email) return reply.code(400).send({ error: "Google account has no email" });
      const firstName = userInfo.given_name || "Unknown";
      const lastName = userInfo.family_name || "";
      const userName = email.split("@")[0];
      let profileImage = userInfo.picture;
      let user = await findUserByEmail(email);
      if (!user) {
        if (profileImage.length < 100)
            profileImage = "https://localhost:8443/default.png";
          user = await createUser(
            firstName,
            lastName,
            userName,
            email,
            Math.random().toString(36),
            profileImage
          );
          user = await findUserByEmail(email);
        }
        console.log("-------------> profile image : ", user.profileImage);
      
     const jwtToken = fastify.jwt.sign({
        id: user.id,
        userName: user.userName,
        fullName: `${user.firstName} ${user.lastName}`,
        profileImage: user.profileImage
    });

      return reply.redirect(`https://localhost:8443/home?token=${jwtToken}`);
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Google OAuth failed" });
    }
  });

}