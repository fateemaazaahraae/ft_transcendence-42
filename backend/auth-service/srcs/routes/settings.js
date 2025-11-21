import { getProfile, updateProfile, changePassword, toggle2FA } from "../utils/settingsUtils.js"

export default async function settingsRountes(fastify) {
    fastify.get("/me", { preValidation: fastify.authenticate }, getProfile);
    fastify.put("/me", { preValidation: fastify.authenticate }, updateProfile);
    fastify.put("/me/password", { preValidation: fastify.authenticate }, changePassword);
    fastify.put("/me/2fa", { preValidation: fastify.authenticate }, toggle2FA);
}