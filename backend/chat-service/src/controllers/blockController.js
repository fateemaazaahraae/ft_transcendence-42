import blockedModel from "../models/blocked.js";

export const blockUser = async (request, reply) => {
  try {
    const { blockedId } = request.body || {};
    const authHeader = request.headers.authorization || '';
    if (!blockedId) return reply.code(400).send({ error: 'missing blockedId' });
    const result = await blockedModel.block(authHeader, null, blockedId);
    return reply.code(201).send(result);
  } catch (e) {
    return reply.code(e.status || 500).send({ error: 'block failed', details: e.message, payload: e.payload });
  }
};
export const isBlocked = async (request, reply) => {
  const { blockerId, blockedId } = request.params;
  const authHeader = request.headers.authorization || '';
  const isBlocked = await blockedModel.isBlocked(authHeader, blockerId, blockedId);
  return reply.send({ isBlocked });
};

export const unblock= async (request, reply) => {
  try {
    const { blockedId } = request.body || {};
    const authHeader = request.headers.authorization || '';
    if (!blockedId) return reply.code(400).send({ error: 'missing blockedId' });
    const res = await blockedModel.unblock(authHeader, null, blockedId);
    return reply.send(res?.success ? res : { ok: true });
  } catch (e) {
    return reply.code(e.status || 500).send({ error: 'unblock failed', details: e.message, payload: e.payload });
  }
};