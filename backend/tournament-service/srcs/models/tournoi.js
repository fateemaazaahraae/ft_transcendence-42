import { v4 as uuidv4} from "uuid";
import { openDb } from "./db.js"

export async function createTournament(tournamentName, nickName, image)
{
    const db = await openDb();
    const id = uuidv4();
    await db.run(
        `INSERT INTO tournaments(id, tournamentName, nickName, image)
         VALUES (?, ?, ?, ?)`,
         [id, tournamentName, nickName, image]
    );
    return {id, tournamentName, nickName, image};
}
