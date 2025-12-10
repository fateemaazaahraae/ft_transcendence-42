import db from "../config/db.js";
import { nanoid } from "nanoid";

const addFriendStmt = db.prepare(
  `INSERT OR IGNORE INTO friends (id, user_a, user_b, status) VALUES (?, ?, ?, 'pending')`
);

const acceptFriendStmt = db.prepare(
  `UPDATE friends SET status = 'accepted', updated_at = strftime('%s','now') WHERE (user_a = ? AND user_b = ?) OR (user_a = ? AND user_b = ?)`
);

const rejectFriendStmt = db.prepare(
  `DELETE FROM friends WHERE (user_a = ? AND user_b = ?) OR (user_a = ? AND user_b = ?)`
);

const listFriendsStmt = db.prepare(
  `SELECT * FROM friends WHERE (user_a = ? OR user_b = ?) AND status = 'accepted' ORDER BY updated_at DESC`
);

const listPendingStmt = db.prepare(
  `SELECT * FROM friends WHERE user_b = ? AND status = 'pending' ORDER BY created_at DESC`
);

const isFriendStmt = db.prepare(
  `SELECT 1 FROM friends WHERE (user_a = ? AND user_b = ?) OR (user_a = ? AND user_b = ?) AND status = 'accepted' LIMIT 1`
);

export default {
  addFriend: (user_a, user_b) => {
    const id = nanoid();
    addFriendStmt.run(id, user_a, user_b);
    return { id, user_a, user_b, status: 'pending' };
  },

  acceptFriend: (user_a, user_b) => {
    acceptFriendStmt.run(user_a, user_b, user_b, user_a);
  },

  rejectFriend: (user_a, user_b) => {
    rejectFriendStmt.run(user_a, user_b, user_b, user_a);
  },

  listFriends: (userId) => {
    return listFriendsStmt.all(userId, userId);
  },

  listPending: (userId) => {
    return listPendingStmt.all(userId);
  },

  isFriend: (user_a, user_b) => {
    return !!isFriendStmt.get(user_a, user_b, user_b, user_a);
  }
};
