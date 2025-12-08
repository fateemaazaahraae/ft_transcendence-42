// srcs/plugins/auth.js
export async function authenticate(fastify, options) {
  fastify.decorate("authenticate", async (req, reply) => {
    try {
      const decoded = await req.jwtVerify();
      req.user = decoded;
    } catch (err) {
      console.error("AUTH ERROR:", err);
      return reply.status(401).send({ error: "Unauthorized" });
    }
  });
}
