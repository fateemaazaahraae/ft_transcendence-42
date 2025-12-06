import bcrypt from "bcryptjs"
import { openDb } from "../models/db.js";
import { updateAvatar } from "../models/user.js";
import fs from "fs";
import { pipeline } from "stream/promises"; // pump alternative


// FOR PROFILE SERVICE REQUESTS
export default function userRoutes(fastify) {
    
    // ---- GET DATA ----
    fastify.get("/users/:id", async (req, rep) => {
        const { id } = req.params;
        const db = await openDb();
        const user = await db.get(
            "SELECT id, firstName, lastName, userName, email, profileImage, isTwoFactorEnabled FROM users WHERE id = ?",
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

    // ---- UPDATE THE 2FA
    fastify.put("/users/:id/2fa", async (req, rep) => {
        const { id } = req.params;
        const db = await openDb();
        const exists = await db.get("SELECT id FROM users WHERE id = ?", [id]);
        if (!exists)
            return rep.status(404).send({ message: "User not found" });
        const old2FA = await db.get("SELECT isTwoFactorEnabled FROM users WHERE id = ?", [id])
        const new2FA = !old2FA.isTwoFactorEnabled;
        await db.run(
            `UPDATE users SET isTwoFactorEnabled = ? WHERE id = ?`,
            [new2FA, id]
        )
        return { message: "2FA updated", enabled: new2FA }
    });

    // ---- CHANGE PROFILE IMAGE (avatar) ----
    fastify.put("/users/:id/avatar", async (req, rep) => {
        const { id } = req.params;
        const { profileImage } = req.body;
        if (!profileImage)
            return rep.status(400).send({ error: "Profile image is required" });
        await updateAvatar(id, profileImage);
        return rep.status(200).send({
            message: "Profile image saved successfully",
            profileImage: profileImage
        });
    });

    // ---- CHANGE PROFILE IMAGE (upload) ----
    fastify.put("/users/:id/upload", async (req, rep) => {
        try {
            const file = await req.file();
            if (!file)
                return rep.status(400).send({ error: "No file uploaded" });
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