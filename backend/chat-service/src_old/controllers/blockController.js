import blocked from "../models/blocked";

export const blockHandler = async (request, reply) => {
  const { blockerId, blockedId } = request.body;
  if (!blockerId || !blockedId) return reply.code(400).send({ error: "missing" });
  const entry = Blocked.block(blockerId, blockedId);
  return reply.code(201).send(entry);
};

export const unblockHandler = async (request, reply) => {
  const { blockerId, blockedId } = request.body;
  Blocked.unblock(blockerId, blockedId);
  return reply.code(200).send({ ok: true });
};