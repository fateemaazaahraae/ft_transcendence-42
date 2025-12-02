import bcrypt from "bcryptjs"
import { openDb } from "../models/db.js";

// FOR PROFILE SERVICE REQUESTS
export default function userRoutes(fastify) {
    
    // ---- GET DATA ----
    fastify.get("/users/:id", async (req, rep) => {
        const { id } = req.params;
        const db = await openDb();
        const user = await db.get(
            "SELECT id, firstName, lastName, userName, email, profileImage FROM users WHERE id = ?",
            [id]
        );
        if (!user)
            return rep.status(404).send({ message: "User not found" });
        return user;
    });

    // ---- UPDATE DATA ----
    fastify.put("/users/:id", async (req, rep) => {
        const { id } = req.params;
        const { firstName, lastName, userName, email } = req.body;
        const db = await openDb();
        const exists = await db.get("SELECT id FROM users WHERE id = ?", [id]);
        if (!exists)
            return rep.status(404).send({ message: "User not found" });
        await db.run(
            `UPDATE users SET firstName = ?, lastName = ?, userName = ?, email = ? WHERE id = ?`,
            [firstName, lastName, userName, email, id]
        );
        return { message: "User updated successfully" };
    })

    // ---- UPDATE PASSWORD ----
    fastify.put("/users/:id/password", async (req, rep) => {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        const db = await openDb();
        const exists = await db.get("SELECT id, passwordHash FROM users WHERE id = ?", [id]);
        if (!exists)
            return rep.status(404).send({ message: "User not found" });
        console.log("user pass " + exists.passwordHash + " ---- current is " + currentPassword);
        const isValid = await bcrypt.compare(currentPassword, exists.passwordHash);
        if (!isValid)
            return rep.status(401).send({ message: "Password Incorrect" });
        const newPass = await bcrypt.hash(newPassword, 10);
        await db.run(
            `UPDATE users SET passwordHash = ? WHERE id = ?`,
            [newPass, id]
        );
        return { message: "Password updated successfully" };
    });
}