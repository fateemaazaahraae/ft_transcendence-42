import { request } from "node:http";
import { getDb } from "../models/db.js";

export async function tournamentRoutes(fastify)
{
    fastify.post("/tournamentwinner/:userId", async (request, reply) => {
        
        const userId = request.params.userId;
        console.log(`dkhelt winner ${userId}`);
        const db = await getDb();
        await db.run(`UPDATE wlxp
            SET Wins = Wins + 1,
                XPoints = XPoints + 50
            WHERE id = ?`,
            [userId]
        );
        return reply.send({ success: true });
    });

    fastify.post("/tournamentloser/:userId", async (request, reply) => {

        const userId = request.params.userId;
        console.log(`dkhelt loser ${userId}`);
        const db = await getDb();
        await db.run(`UPDATE wlxp
            SET Losses = Losses + 1
            WHERE id = ?`,
            [userId]
        );
        return reply.send({ success: true });
    });

    fastify.post("/tournamentmatches", async (request, reply) => {
        const { matchId, player1, player2, score1, score2, winner, timestamp } = request.body;
        const db = await getDb();
        await db.run(
            `INSERT INTO matches (id, player1Id, player2Id, score1, score2, winnerId, timestamp)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                matchId,
                player1,
                player2,
                score1,
                score2,
                winner,
                timestamp
            ]
        );
        return reply.send({ success: true });
    });
}