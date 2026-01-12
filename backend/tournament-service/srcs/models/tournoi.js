import { v4 as uuidv4} from "uuid";
import { openDb } from "./db.js"

export async function createTournament(tournamentName, nickName)
{
    const db = await openDb();
    const id = uuidv4();
    await db.run(
        `INSERT INTO tournaments(id, tournamentName, nickName, players)
         VALUES (?, ?, ?, ?)`,
         [id, tournamentName, nickName, 1]
    );
    const players = await db.get(`SELECT players from tournaments WHERE id = ?`, [id] );
    return {id, tournamentName, nickName, players};
}

export async function storeAchievements(winnerId)
{
    const db = await openDb();

    const countRow = await db.get(
    `SELECT COUNT(*) as count FROM achievements WHERE winnerId = ?`,
    [winnerId]
  );

  const trophyId = Math.min(countRow.count + 1, 6); // max 6 trophies

  await db.run(
    `INSERT INTO achievements (winnerId, trophyId)
     VALUES (?, ?)`,
    [winnerId, trophyId]
  );

  return { winnerId, trophyId };
}

export async function initTrophies() {
    const db = await openDb();
    const trophyImages = [
        "/public/trophy1.svg",
        "/public/trophy2.svg",
        "/public/trophy3.svg",
        "/public/trophy4.svg",
        "/public/trophy5.svg",
        "/public/trophy6.svg"
    ];

    for (let i = 0; i < trophyImages.length; i++) {
        await db.run(
            `INSERT INTO trophies (img_src)
             SELECT ? WHERE NOT EXISTS (SELECT 1 FROM trophies WHERE id = ?)`,
            [trophyImages[i], i + 1]
        );
    }
}


