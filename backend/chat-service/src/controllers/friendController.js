// chat-service
import { socket } from "../controllers/wsManager.js";

export const friendAccepted = (req, res) => {
  const { userId, friendId } = req.body;

  if (!userId || !friendId) {
    return res.status(400).json({ error: "missing ids" });
  }

  // online
  socket.to(String(userId)).emit("friend_accepted", {
    friendId
  });

  socket.to(String(friendId)).emit("friend_accepted", {
    friendId: userId
  });

  return res.json({ ok: true });
};
