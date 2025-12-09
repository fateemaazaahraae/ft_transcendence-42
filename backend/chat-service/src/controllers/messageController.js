import conversation from "../models/conversation.js";
import history from "../services/history.js";

export const sendMessageHandler = async (request, reply) => {
  try {
    const { senderId, receiverId, content } = request.body;
    if (!senderId || !receiverId || !content) return reply.code(400).send({ error: "missing fields" });

    const { convo, msg } = messageService.sendMessage(senderId, receiverId, content);

    // reply with created message + convo id
    return reply.code(201).send({ conversation: convo, message: msg });
  } catch (err) {
    if (err.code === "BLOCKED") return reply.code(403).send({ error: "you are blocked by recipient" });
    console.error(err);
    return reply.code(500).send({ error: "internal" });
  }
};

  export const getHistoryHandle = async (request,repl) =>{
    const { userA, userB } =request.params;
    const { messages, convo }= history.getHistory(userA,userB);
    return reply.send({conversation: convo, messages});

  };