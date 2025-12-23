import Conversation from "../models/conversation.js";
import Messages from "../models/messages.js";
import Blocked from "../models/blocked.js";

export default {
  sendMessage: async (from, to, content, authHeader = '') => {
    // check if blocked (relationship service call is async)
    const blocked = await Blocked.isBlocked(authHeader, to, from);
    if (blocked) {
      const err = new Error("blocked");
      err.code = "BLOCKED";
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