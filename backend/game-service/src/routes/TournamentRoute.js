import { getDb } from "../models/db.js";

export async function tournamentRoutes(fastify)
{
    fastify.post("/tournamentwinner/:userId", async () => {
        
        const userId = request.params.userId;
        console.log(`userrrrrr Id is: ${userId}`)
        const db = await getDb();
        // await db.run(
        //             `INSERT OR IGNORE INTO wlxp (id) VALUES (?)`,
        //             [userId]
        //         );
        await db.run(`UPDATE wlxp
                    SET Wins = Wins + 1,
                        XPoints = XPoints + 50
                    WHERE id = ?`,
                    [userId]
                    );
    });

    fastify.post("/tournamentloser/:userId", async () => {

        const userId = request.params.userId;
        const db = await getDb();
            // await db.run(
            //         `INSERT OR IGNORE INTO wlxp (id) VALUES (?)`,
            //         [userId]
            //     );
        await db.run(`UPDATE wlxp
                    SET Losses = Losses + 1
                    WHERE id = ?`,
                    [userId]
                    );
    });
}