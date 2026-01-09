import { getDb } from "../models/db.js";

export default async function GameRoutes(fastify, options) {
  fastify.get('/test', async (request, reply) => {
    return { message: 'Game service is working!' };
  });

  fastify.get('/matches/user/:userId', async (request, reply) => {
      const userId = request.params.userId;
      try {
          const db = await getDb();
          
          const matches = await db.all(
            `SELECT * FROM matches 
            WHERE player1Id = ? OR player2Id = ? 
            ORDER BY timestamp DESC`,
            [userId, userId]
          );
          
          return matches;
      } catch (err) {
          console.error(err);
          return reply.code(500).send({ error: 'Database error' });
      }
  });

  fastify.get('/wlxp/:userId', async (request, reply) => {
      const userId = request.params.userId;
      try {
          const db = await getDb();
          
          let wlxp = await db.get(
            `SELECT Wins, Losses, XPoints
            FROM wlxp 
            WHERE id = ?`,
            [userId]
          );
          
          if (!wlxp) {
            await db.run(
              `INSERT INTO wlxp (id, Wins, Losses, XPoints) 
              VALUES (?, 0, 0, 0)`,
              [userId]
            );
            
            wlxp = await db.get(
              `SELECT Wins, Losses, XPoints
              FROM wlxp 
              WHERE id = ?`,
              [userId]
            );
          }
          
          return wlxp;
      } catch (err) {
          console.error(err);
          return reply.code(500).send({ error: 'Database error' });
      }
  });

  fastify.get("/leaderboard", async() => {
      const db = await getDb();
      const users = await db.all(
        `SELECT id, XPoints
         FROM wlxp
         ORDER BY XPoints DESC`
      );
      return users;
  });
}