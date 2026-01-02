import { getDb } from "../models/db.js";

export function testRoute(fastify) {
  fastify.get('/test', async (request, reply) => {
    return { message: 'Game service is working!' };
  });
}

export function matchesRoute(fastify) {
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
}

export function WLXPRoute(fastify) {
  fastify.get('/wlxp/:userId', async (request, reply) => {
      const userId = request.params.userId;
      try {
          const db = await getDb();
          
          const wlxp = await db.get(
            `SELECT Wins, Losses, XPoints
            FROM wlxp 
            WHERE id = ?`,
            [userId]
          );

          console.log("in getttt wlxp route!!");
          // if (!wlxp)
          //   return reply.code(404).send({ error: 'User not found' });
          
          if (!wlxp) {
            await db.run(
              `INSERT INTO wlxp (id, Wins, Losses, XPoints) 
              VALUES (?, 0, 0, 0)`,
              [userId]
            );
            
            // Now get the newly created record
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
}
