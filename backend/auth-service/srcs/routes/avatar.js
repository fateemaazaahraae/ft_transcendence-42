// srcs/routes/avatar.js
import { updateAvatar, findUserById } from "../models/user.js";

export default async function avatarRoutes(fastify) {

 fastify.post("/user/avatar/:id", async (req, reply) => {
  try {
    const userId = req.params.id;
    const { profileImage } = req.body;
    if (!profileImage) {
      return reply.status(400).send({ error: "Profile image is required" });
    }
    await updateAvatar(userId, profileImage);
    const user = await findUserById(userId);
    const token = fastify.jwt.sign({
        id: userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        profileImage: profileImage
      });
    return reply.send({ message: "Profile image saved successfully",
      user1: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          email: user.email,
        },
        token });

  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Server error" });
  }
});


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

        return reply.send({ user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          email: user.email,
          profileImage: user.profileImage
        }});

      } catch (err) {
        console.error(err);
        return reply.status(500).send({ error: "Server errorrr" });
      }
    }
  );
};
