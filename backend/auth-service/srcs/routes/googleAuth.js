import { findUserByEmail, createUser } from "../models/user.js";
import fetch from "node-fetch";

export function googleAuthRoutes(fastify) {
  fastify.get("/auth/google/callback", async (request, reply) => {
    try {
      const code = request.query.code;
      if (!code) return reply.redirect(`http://localhost/login`);

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

      let user = await findUserByEmail(email);
      if (!user) {
        const userName = email.split("@")[0];
        user = await createUser(
          userInfo.given_name || "Unknown",
          userInfo.family_name || "",
          userName,
          email,
          Math.random().toString(36) // random password
        );
      }

      const jwtToken = fastify.jwt.sign({ id: user.id, userName: user.userName });

      return reply.redirect(`http://localhost/home?token=${jwtToken}`);
    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Google OAuth failed" });
    }
  });

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
}
