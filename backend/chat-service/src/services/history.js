import Conversation from "../models/conversation.js";
import Messages from "../models/messages.js";
import Blocked from "../models/blocked.js";

const REL_SERVICE_URL = process.env.REL_SERVICE_URL || 'http://relationship-service:3002';

export default {
  sendMessage: async (from, to, content, authHeader = '') => {

    const blocked = await Blocked.isBlocked(authHeader, to, from);
    if (blocked) {
      const err = new Error("blocked");
      err.code = "BLOCKED";
      throw err;
    }

    // check friendship status via relationship service
    try {
      const res = await fetch(`${REL_SERVICE_URL}/friends/status/${to}`, {
        headers: { Authorization: authHeader }
      });
      if (!res.ok) {
        let body = '(no body)';
        try { body = await res.text(); } catch (e) { body = `(failed to read body: ${e.message})`; }
        const err = new Error("not_friend");
        err.code = "NOT_FRIEND";
        throw err;
      }
      const data = await res.json();
      if (data.status !== 'friend') {
        const err = new Error("not_friend");
        err.code = "NOT_FRIEND";
        throw err;
      }
    } catch (e) {
      if (e.code === 'NOT_FRIEND') throw e;
      console.warn(' relationship service error', e.message || e);
      const err = new Error("not_friend");
      err.code = "NOT_FRIEND";
      throw err;
    }

    // find or create conversation
    const convo = Conversation.findOrCreate(from, to);

    // create message
    const msg = Messages.create(convo.id, from, content);
    return { convo, msg };
  },

  getHistory: async (userA, userB, limit = 200) => {
    const convo = Conversation.findOrCreate(userA, userB); // findOrCreate ensures an id
    const messages = Messages.getConversationMessages(convo.id, limit);
    return { convo, messages };
  }
};