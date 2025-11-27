export function settingsRoutes(fastify) {
    // ---- GET USER INFORMATIONS ----
    fastify.get("/settings/:id", async (req, rep) => {
        const { id } = req.params;
        const user = await fastify.db.get(
            "SELECT id, firstName, lastName, userName, email, age, gender FROM users WHERE id = ?",
            [id]
        );
        return user;
    })

    // ---- UPDATE USER INFORMATIONS ----
    fastify.put("/settings/:id", async (req, rep) => {
        const { id } = req.params;
        const { firstName, lastName, userName, email, age, gender } = req.body
        await fastify.db.run(
            `UPDATE users SET firstName = ?, lastName = ?, userName = ?, email = ?, age = ?, gender = ? WHERE id = ?`,
            [firstName, lastName, userName, email, age, gender, id]
        );
        return {message: "Profile updated successfully :)"}
    });

    // ---- UPDATE PASSWORD ----
    fastify.put("/settings/:id/password", async (req, rep) => {
        const { id } = req.params;
        const { currentPassword, newPassword } = req.body
        const user = await fastify.db.get("SELECT passwordHash FROM users WHERE id = ?", [id])
        if (!user)
            return rep.status(404).send({message: "User not found"})
        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid)
            return rep.status(401).send({message: "Current password is not correct"});
        const newHash = bcrypt.hash(newPassword, 10);
        await fastify.db.run("UPDATE users SET passwordHash = ? WHERE id = ?", [newHash, id]);

        return {message: "Password updated successfully :)"}
    });
}
