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
            const image = body.image || "";
            if (!tournamentName)
                return reply.code(400).send({error: "Tournament name is required!"});
            if(!nickName)
                return reply.code(400).send({error: "Nick name is required!"});
            const newTour = await createTournament(tournamentName, nickName, image);
            return reply.code(201).send({
                message: "tournament created successfully",
                tournament:{
                    id: newTour.id,
                    tournamentName: newTour.tournamentName,
                    nickName: newTour.nickName,
                    image: newTour.image,
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
            `SELECT id, tournamentName, nickName, image
             FROM tournaments`
        );
        return tournaments;
    });

     // ---- CHANGE TOURNAMENT IMAGE (avatar) ----
        fastify.put("/tournament/:id/avatar", async (req, rep) => {
            const { id } = req.params;
            const { profileImage } = req.body;
            if (!profileImage)
                return rep.status(400).send({ code: "PROFILE_REQUIRED" });
            await updateAvatar(id, profileImage);
            return rep.status(200).send({
                code: "AVATAR_UPDATED_SUCCESS",
                profileImage: profileImage
            });
        });
    
        // ---- CHANGE TOURNAMENTIMAGE (upload) ----
        fastify.put("/users/:id/upload", async (req, rep) => {
            try {
                const file = await req.file();
                if (!file)
                    return rep.status(400).send({ code: "PROFILE_REQUIRED" });
                const db = await openDb();
                const fileName = Date.now() + "-" + file.filename;
                const fullPath = "./uploads/" + fileName;
                await pipeline(file.file, fs.createWriteStream(fullPath));
                await db.run(
                    "UPDATE users SET profileImage = ? WHERE id = ?",
                    ["/uploads/" + fileName, req.params.id]
                );
                return rep.status(200).send({
                    message: "Image updated",
                    profileImage: "/uploads/" + fileName
                });
            }
            catch (err) {
                console.error(err);
                return rep.status(500).send({ error: "Upload failed", details: err.message });
            }
        });
}
