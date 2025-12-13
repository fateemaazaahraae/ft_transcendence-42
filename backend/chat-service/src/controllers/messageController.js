import history from "../services/history.js";

export const sendMessageHandler = async (request, reply) => {
  try {
    const { senderId, receiverId, content } = request.body;
    if (!senderId || !receiverId || !content) return reply.code(400).send({ error: "missing fields" });
    const { convo, msg } = history.sendMessage(senderId, receiverId, content);
    return reply.code(201).send({ conversation: convo, message: msg });
  } catch (err) {
    if (err.code === "BLOCKED") return reply.code(403).send({ error: "you are blocked by recipient" });
    console.error(err);
    return reply.code(500).send({ error: "internal" });
  }
};

export const getHistoryHandle = async (request, reply) => {
  const { userA, userB } = request.params;
  const { messages, convo } = history.getHistory(userA, userB);
  return reply.send({ conversation: convo, messages });
};