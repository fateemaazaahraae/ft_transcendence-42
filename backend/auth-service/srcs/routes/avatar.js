// srcs/routes/avatar.js
import { updateAvatar, findUserById } from "../models/user.js";

export default async function avatarRoutes(fastify) {

 fastify.post("/user/avatar", { preHandler: fastify.authenticate }, async (req, reply) => {
  try {
    console.log("req.user =", req.user);
    console.log("body =", req.body);
    const userId = req.user.id;
    const { profileImage } = req.body;


    if (!profileImage) {
      return reply.status(400).send({ error: "Profile image is required" });
    }

    await updateAvatar(userId, profileImage);

    return reply.send({ message: "Profile image saved successfully" });

  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Server error" });
  }
});



  // Get user avatar (requires auth)
  fastify.get(
    "/user/avatar",
    { preHandler: fastify.authenticate },
    async (req, reply) => {
      try {
        const user = await findUserById(req.user.id);
        if (!user) return reply.status(404).send({ error: "User not found" });

        return reply.send({ profileImage: user.profileImage });
      } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: "Server errorr" });
      }
    }
  );

  // Get full user info (requires auth)
  fastify.get(
    "/user/me",
    { preHandler: fastify.authenticate },
    async (req, reply) => {
      try {
        const user = await findUserById(req.user.id);
        if (!user) return reply.status(404).send({ error: "User not found" });

        return reply.send({ user });
      } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: "Server errorrr" });
      }
    }
  );
};
