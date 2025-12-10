import db from "../config/db.js";
import { nanoid } from "nanoid";

const insertBlockedStmt = db.prepare(
  `INSERT OR IGNORE INTO blocked_users (id, blocker_id, blocked_id, created_at) VALUES (?, ?, ?, strftime('%s','now'))`
);

const isBlockedStmt = db.prepare(
  `SELECT 1 FROM blocked_users WHERE blocker_id = ? AND blocked_id = ? LIMIT 1`
);

const deleteBlockedStmt = db.prepare(
  `DELETE FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?`
);

export default {
  block: (blocker, blocked) => {
    const id = nanoid();
    insertBlockedStmt.run(id, blocker, blocked);
    return { id, blocker_id: blocker, blocked_id: blocked };
  },

  unblock: (blocker, blocked) => {
    deleteBlockedStmt.run(blocker, blocked);
  },

  isBlocked: (blocker, blocked) => {
    return !!isBlockedStmt.get(blocker, blocked);
  }
};