import { delete2FACode, get2FACode } from "../models/2FA.js";

export function twoFactorRoutes(fastify) {
    fastify.post("/verify-2fa", async (request, reply) => {
        try{
            const { userId, code } = request.body;
            if (!userId || !code)
                return reply.code(400).send({error: "UserId and code are required"});

            const record = await get2FACode(userId);
            if (!record)
                return reply.code(400).send({error: "No 2FA code found"});

            if (record.code !== code)
                return reply.code(400).send({error: "Invalid code"});

            if (Date.now() > record.expire_date)
                return reply.code(400).send({error: "Code Expired"});

            await delete2FACode(userId);
            return reply.code(200).send({error: "2FA verification successfully"});
        }
        catch(err){
            console.log(err);
            return reply.code(500).send({error: "Internal Server Error"})
        }
    });
}