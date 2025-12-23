import blocked from "../models/blocked.js";

export const blockHandler = async (request, reply) => {
  const { blockerId, blockedId } = request.body;
  if (!blockerId || !blockedId) return reply.code(400).send({ error: "missing" });
  const authHeader = request.headers.authorization || '';
  await blocked.block(authHeader, blockerId, blockedId);
  return reply.code(201).send({ ok: true });
};

export const unblockHandler = async (request, reply) => {
  const { blockerId, blockedId } = request.body;
  const authHeader = request.headers.authorization || '';
  await blocked.unblock(authHeader, blockerId, blockedId);
  return reply.code(200).send({ ok: true });
};