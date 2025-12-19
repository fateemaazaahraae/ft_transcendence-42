import Conversation from "../models/conversation.js";
import Messages from "../models/messages.js";
import Blocked from "../models/blocked.js";

export default {
  sendMessage: (from, to, content) => {
    // checki if blocked
    if (Blocked.isBlocked(to, from)) {
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

  getHistory: (userA, userB, limit = 200) => {
    const convo = Conversation.findOrCreate(userA, userB); // findOrCreate garantit an id
    const messages = Messages.getConversationMessages(convo.id, limit);
    return { convo, messages };
  }
};