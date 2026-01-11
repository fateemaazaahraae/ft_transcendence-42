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


