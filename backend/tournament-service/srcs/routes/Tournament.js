import { Server } from "socket.io";
import { createTournament } from "../models/tournoi.js";
import { openDb } from "../models/db.js";

// export const StartTournament = (server) => {

//     const io = new Server(server, { cors: { origin: "*" }, methods: ["GET", "POST"] });
    
//     io.on('connection', (socket) => {
//         const token = socket.handshake.auth.token;
//         if (!token) { // check tocken (JWT)
//             console.log('❌ Connection rejected: No token provided.');
//             socket.disconnect();
//             return;
//         }
//         console.log('I think we are connected!!');
//     });
// }

export default async function TournamentRoutes(fastify) {

    fastify.post("/createTournament", async (request, reply) =>{
        try{
            const body = request.body;
            const tournamentName = body.tourName || "";
            const nickName = body.nickName || "";
            if (!tournamentName)
                return reply.code(400).send({error: "Tournament name is required!"});
            if(!nickName)
                return reply.code(400).send({error: "Nick name is required!"});
            const newTour = await createTournament(tournamentName, nickName);
            return reply.code(201).send({
                message: "tournament created successfully",
                tournament:{
                    id: newTour.id,
                    tournamentName: newTour.tournamentName,
                    nickName: newTour.nickName,
                    players: newTour.players,
                },
            }); 
        }
        catch(err)
        {
            console.error(err);
            return reply.code(500).send({ error: "Internal Server Error" });
        }
    });

    // ---- GET TOURNAMENTS TABLE ---

    fastify.get("/tournaments", async() => {
        const db = await openDb();
        const tournaments = await db.all(
            `SELECT id, tournamentName, nickName
             FROM tournaments`
        );
        return tournaments;
    });

}
