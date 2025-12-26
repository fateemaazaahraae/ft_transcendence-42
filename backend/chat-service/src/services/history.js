import Conversation from "../models/conversation.js";
import Messages from "../models/messages.js";
import Blocked from "../models/blocked.js";

const REL_SERVICE_URL = process.env.REL_SERVICE_URL || 'http://relationship-service:3002';

export default {
  sendMessage: async (from, to, content, authHeader = '') => {
    // check if recipient has blocked the sender
    const blocked = await Blocked.isBlocked(authHeader, Number(to), Number(from));
    if (blocked) {
      const err = new Error("blocked");
      err.code = "BLOCKED";
      throw err;
    }
   
    // check friendship status via relationship service (minimal check)
    try {
      const res = await fetch(`${REL_SERVICE_URL}/friends/status/${to}`, {
        headers: { Authorization: authHeader }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.status !== 'friend') {
        const err = new Error("not_friend");
        err.code = "NOT_FRIEND";
        throw err;
      }
    } catch (e) {
      const err = new Error("not_friend");
      err.code = "NOT_FRIEND";
      throw err;
    }

    // find or create conversation
    const convo = Conversation.findOrCreate(from, to);

    // create message
    const msg = Messages.create(convo.id, from, content);

     //profile image
    const uRes = await fetch(`${AUTH_URL}/users/${from}`, { headers: { Authorization: authHeader }});
    const u = uRes.ok ? await uRes.json() : {};
    msg.avatar = normalize(u.profileImage);
    return { convo, msg }; // ack includes avatar
  },

  getHistory: async (userA, userB, limit = 200) => {
    const convo = Conversation.findOrCreate(userA, userB); // findOrCreate ensures an id
    const messages = Messages.getConversationMessages(convo.id, limit);
    return { convo, messages };
  }
};