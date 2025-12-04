import { openDb } from "../models/db.js"

export function settingsRoutes(fastify) {
    // ---- GET USER INFORMATIONS ----
    fastify.get("/settings/:id", async (req, rep) => {
        const { id } = req.params;
        const authResponse = await fetch(`http://auth-service:3000/users/${id}`);
        if (!authResponse.ok)
            return rep.status(404).send({ message: "User not found in auth-service"});
        const authUser = await authResponse.json();
        const db = await openDb();
        const profile = await db.get(
            "SELECT age, gender FROM profile WHERE id = ?",
            [id]
        );
        return {
            id,
            firstName: authUser.firstName,
            lastName: authUser.lastName,
            userName: authUser.userName,
            email: authUser.email,
            profileImage: authUser.profileImage,
            age: profile?.age || null,
            gender: profile?.gender || null,
            isTwoFactorEnabled: authUser.isTwoFactorEnabled
        };
    });

    // ---- UPDATE USER INFORMATIONS ----
    fastify.put("/settings/:id", async (req, rep) => {
        const { id } = req.params;
        const { firstName, lastName, userName, email, age, gender, currentPassword, newPassword } = req.body

        if (currentPassword && newPassword)
        {
            const passWordResponse = await fetch(`http://auth-service:3000/users/${id}/password`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword })
            });
            const passWordData = await passWordResponse.json();
            if (!passWordResponse.ok)
                return rep.status(passWordResponse.status).send(passWordData);
        }
        const authResponse = await fetch(`http://auth-service:3000/users/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName, userName, email })
        })
        const authData = await authResponse.json();
        if (!authResponse.ok)
            return rep.status(authResponse.status).send(authData);

        const db = await openDb();
        await db.run(
            `INSERT INTO profile(id, age, gender) VALUES(?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET age = excluded.age, gender = excluded.gender`,
            [id, age, gender]
        );
        return { message: "Profile updated successfully :)" }
    });

    // ---- Enable/Disable 2fa ----
    fastify.put("/settings/:id/2fa", async (req, rep) => {
        const { id } = req.params;
        const res = await fetch(`http://auth-service:3000/users/${id}/2fa`, {
            method: "PUT"
        })
        const data = await res.json();
        return rep.status(res.status).send(data);
    })

    // ---- Change profileImage ----
    fastify.put("/settings/:id/avatar", async (req, rep) => {
        const { id } = req.params;
        const { profileImage } = req.body;
        const res = await fetch(`http://auth-service:3000/users/${id}/avatar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ profileImage })
        })
        const data = await res.json();
        return rep.status(res.status).send(data);
    });
}
