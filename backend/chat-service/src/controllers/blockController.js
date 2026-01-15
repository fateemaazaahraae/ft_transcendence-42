import blockedModel from "../models/blocked.js";
import { socket, suppressReonline } from "./wsManager.js";

export const blockUser = async (request, reply) => {
  try {
    const { blockedId } = request.body || {};
    const blockerId = request.user && request.user.id ? String(request.user.id) : null;
    const authHeader = request.headers.authorization || '';
    request.log.info({ hasAuth: !!authHeader, blockedId }, '[chat] POST /api/block received');

    if (!blockedId) return reply.code(400).send({ error: 'missing blockedId' });
    const result = await blockedModel.block(authHeader, null, blockedId);
    // REALTIME notify affected users from server side 
    try {
      if (socket) {
        try {
          const room = socket.sockets && socket.sockets.adapter && socket.sockets.adapter.rooms && socket.sockets.adapter.rooms.get(String(blockerId));
          const roomSize = room ? room.size : 0;
          request.log.info({ blockerId, blockedId, roomSize }, '[chat] realtime block notify - room info');
        } catch (rerr) {
          request.log.warn('failed to read socket room info', rerr);
        }
        // notify the blocked user that they were blocked (exclude sender)
        socket.to(String(blockedId)).emit("you_were_blocked", { by: blockerId });
        request.log.info({ to: blockedId, event: 'you_were_blocked' }, '[chat] emitted you_were_blocked');
        // notify all blocker's sessions that block completed
        socket.to(String(blockerId)).emit("block_done", { target: blockedId });
        request.log.info({ to: blockerId, event: 'block_done' }, '[chat] emitted block_done');
        // immediately hide blocked users presence for the blocker
        socket.to(String(blockerId)).emit("user_offline", { userId: String(blockedId) });
        request.log.info({ to: blockerId, event: 'user_offline', about: blockedId }, '[chat] emitted user_offline');
        try { suppressReonline(blockerId, blockedId, 3000); } catch (e) { request.log.warn('suppressReonline failed', e); }
      }
    } catch (e) {
      request.log.warn('realtime block notify failed', e);
    }

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
    const unblockedBy = request.user && request.user.id ? String(request.user.id) : null;
    
    const authHeader = request.headers.authorization || '';
    if (!blockedId) return reply.code(400).send({ error: 'missing blockedId' });
    const res = await blockedModel.unblock(authHeader, null, blockedId);

     try {
      if (socket) {
        
        try {
          const roomB = socket.sockets && socket.sockets.adapter && socket.sockets.adapter.rooms && socket.sockets.adapter.rooms.get(String(blockedId));
          const roomBSize = roomB ? roomB.size : 0;
          const roomU = socket.sockets && socket.sockets.adapter && socket.sockets.adapter.rooms && socket.sockets.adapter.rooms.get(String(unblockedBy));
          const roomUSize = roomU ? roomU.size : 0;
          request.log.info({ blockedId, unblockedBy, roomBSize, roomUSize }, '[chat] realtime unblock notify - room info');
        } catch (rerr) {
          request.log.warn('failed to read socket room info (unblock)', rerr);
        }

        // inform the unblocked user
        socket.to(String(blockedId)).emit("you_were_unblocked", { by: unblockedBy });
        request.log.info({ to: blockedId, event: 'you_were_unblocked' }, '[chat] emitted you_were_unblocked');
        // inform the unblocking user (confirmation)
        socket.to(String(unblockedBy)).emit("unblock_done", { target: blockedId });
        request.log.info({ to: unblockedBy, event: 'unblock_done' }, '[chat] emitted unblock_done');

        // if the unblocked user is currently online tell the unblocking user they are online
        try {
          const room = socket.sockets && socket.sockets.adapter && socket.sockets.adapter.rooms && socket.sockets.adapter.rooms.get(String(blockedId));
          const isOnline = room && room.size > 0;
          request.log.info({ blockedId, isOnline }, '[chat] presence post-unblock check');
          if (isOnline) {
            socket.to(String(unblockedBy)).emit("user_online", { userId: String(blockedId) });
            request.log.info({ to: unblockedBy, event: 'user_online', about: blockedId }, '[chat] emitted user_online (post-unblock)');
          }
        } catch (inner) {
          request.log.warn('presence post-unblock check failed', inner);
        }
      }
    } catch (e) {
      request.log.warn('realtime unblock notify failed', e);
    }

    return reply.send(res?.success ? res : { ok: true });
  } catch (e) {
    return reply.code(e.status || 500).send({ error: 'unblock failed', details: e.message, payload: e.payload });
  }
};