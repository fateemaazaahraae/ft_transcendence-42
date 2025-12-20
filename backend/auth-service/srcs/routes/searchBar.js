import { openDb } from "../models/db.js";

export async function searchRoute(fastify) {
  fastify.get("/search", { preHandler: fastify.authenticate }, async (req, reply) => {
    const search = req.query.search?.trim();
    if (!search) return [];

    const db = await openDb();
    const users = await db.all(
      `SELECT id, userName, profileImage, firstName, lastName
       FROM users
       WHERE userName LIKE ? AND id != ?
       ORDER BY userName
       LIMIT 4`,
      [`${search}%`, req.user.id]
    );

    return users;
  });
}
