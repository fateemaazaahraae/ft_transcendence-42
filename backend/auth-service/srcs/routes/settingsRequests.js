import bcrypt from "bcryptjs"
import { openDb } from "../models/db.js";
import { updateAvatar } from "../models/user.js";
import fs from "fs";
import { pipeline } from "stream/promises";

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
            return rep.status(404).send({ code: "USER_NOT_FOUND" });
        return user;
    });

    // ---- UPDATE DATA ----
    fastify.put("/users/:id", async (req, rep) => {
        const { id } = req.params;
        const { firstName, lastName, userName, email } = req.body;
        const db = await openDb();
        const exists = await db.get("SELECT id FROM users WHERE id = ?", [id]);
        if (!exists)
            return rep.status(404).send({ code: "USER_NOT_FOUND" });
        await db.run(
            `UPDATE users SET firstName = ?, lastName = ?, userName = ?, email = ? WHERE id = ?`,
            [firstName, lastName, userName, email, id]
        );
        return rep.send({ code: "PROFILE_UPDATED_SUCCESS" });
    })

    // ---- UPDATE PASSWORD ----
    fastify.put("/users/:id/password", async (req, rep) => {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body;

        const db = await openDb();
        const exists = await db.get("SELECT id, passwordHash FROM users WHERE id = ?", [id]);
        if (!exists)
            return rep.status(404).send({ code: "USER_NOT_FOUND" });
        const isValid = await bcrypt.compare(currentPassword, exists.passwordHash);
        if (!isValid)
            return rep.status(401).send({ code: "PASSWORD_INCORRECT" });
        const newPass = await bcrypt.hash(newPassword, 10);
        await db.run(
            `UPDATE users SET passwordHash = ? WHERE id = ?`,
            [newPass, id]
        );
        return { code: "PASSWORD_UPDATED" };
    });

    // ---- UPDATE THE 2FA
    fastify.put("/users/:id/2fa", async (req, rep) => {
        const { id } = req.params;
        const db = await openDb();
        const exists = await db.get("SELECT id FROM users WHERE id = ?", [id]);
        if (!exists)
            return rep.status(404).send({ code: "USER_NOT_FOUND" });
        const old2FA = await db.get("SELECT isTwoFactorEnabled FROM users WHERE id = ?", [id])
        const new2FA = !old2FA.isTwoFactorEnabled;
        await db.run(
            `UPDATE users SET isTwoFactorEnabled = ? WHERE id = ?`,
            [new2FA, id]
        )
        return rep.send({ code: "TWOFA_UPDATED", enabled: new2FA });
    });

    // ---- CHANGE PROFILE IMAGE (avatar) ----
    fastify.put("/users/:id/avatar", async (req, rep) => {
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

    // ---- CHANGE PROFILE IMAGE (upload) ----
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

    // ---- GET LANGUAGE ----
    fastify.get("/users/:id/language", async (req, rep) => {
        const { id } = req.params;
        const db = await openDb();
        const user = await db.get("SELECT language FROM users WHERE id = ?",
            [id]
        );
        if (!user)
            return rep.status(404).send({ code: "USER_NOT_FOUND" });
        return {
            id,
            lang: user.language
        };
    });

    // ---- UPDATE LANGUAGE ----
    fastify.put("/users/:id/language", async (req, rep) => {
        const { id } = req.params;
        const { lang } = req.body;
        const db = await openDb();
        await db.run(
            "UPDATE users SET language = ? WHERE id = ?",
            [lang, id]
        );
        console.log("\n\n\n" + lang + "\n\n\n")
        return rep.status(200).send({ code: "LANG_UPDATED", lang });
    });
}