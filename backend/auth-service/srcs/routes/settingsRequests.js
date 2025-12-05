import bcrypt from "bcryptjs"
import { openDb } from "../models/db.js";
import { updateAvatar } from "../models/user.js";

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

    // ---- Change profileImage (avatar) ----
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

    // ---- Change profileImage (upload) ----
    fastify.put("/users/:id/upload", async (req, rep) => {
        const data = await req.file();
        if (!data)
            return rep.status(400).send({ error: "No file uploaded" });

        const fileName = Date.now() + "-" + data.filename;
        const filePath = "/uploads/" + fileName;

        await pump(data.file, fs.createWriteStream("./uploads/" + fileName));

        await db.run(
            "UPDATE users SET profileImage = ? WHERE id = ?",
            [filePath, req.params.id]
        );

        return rep.status(200).send({
            message: "Image updated",
            profileImage: filePath
        });
    });
}