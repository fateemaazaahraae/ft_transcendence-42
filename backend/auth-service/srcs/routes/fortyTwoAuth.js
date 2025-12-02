import fetch from "node-fetch";
import { findUserByEmail, createUser } from "../models/user.js";

export function intra42AuthRoutes(fastify) {

  fastify.get("/auth/42", async (req, reply) => {
    const params = new URLSearchParams({
      client_id: process.env.FORTYTWO_CLIENT_ID,
      redirect_uri: process.env.FORTYTWO_CALLBACK_URL,
      response_type: "code",
    });
    return reply.redirect(`https://api.intra.42.fr/oauth/authorize?${params}`);
  });

  fastify.get("/auth/42/callback", async (req, reply) => {
    const code = req.query.code;
    if (!code) return reply.code(400).send({ error: "No code received" });

    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.FORTYTWO_CLIENT_ID,
      client_secret: process.env.FORTYTWO_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.FORTYTWO_CALLBACK_URL,
    });

    const tokenRes = await fetch("https://api.intra.42.fr/oauth/token", {
      method: "POST",
      headers: { 
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenRes.json();
    console.log("TOKEN RESPONSE:", tokenData);

    if (!tokenData.access_token) {
      return reply.code(400).send({ 
        error: "Failed to get access token from 42", 
        details: tokenData 
      });
    }

    const userRes = await fetch("https://api.intra.42.fr/v2/me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const profile = await userRes.json();
    const { login, first_name, last_name, email, image } = profile;
    const profileImage = image?.link || "";

    let user = await findUserByEmail(email);
    
    if (!user) {
      
      await createUser(first_name, last_name, login, email, Math.random().toString(36), profileImage);
      user = await findUserByEmail(email); // <- RE-FETCH from DB to get proper stored values
    }
    console.log("--------------------------------------------------------->>>>>>>>>>>>>>>> User profileImage stored in JWT:", user.profileImage);

    const jwtToken = fastify.jwt.sign({
        id: user.id,
        userName: user.userName,
        fullName: `${user.firstName} ${user.lastName}`,
        profileImage: user.profileImage
    });

    return reply.redirect(`https://localhost:8443/home?token=${jwtToken}`);

  });

}