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
    const blockerStr = String(blocker);
    const blockedStr = String(blocked);
    insertBlockedStmt.run(id, blockerStr, blockedStr);
    return { id, blocker_id: blockerStr, blocked_id: blockedStr };
  },

  unblock: (blocker, blocked) => {
    const blockerStr = String(blocker);
    const blockedStr = String(blocked);
    deleteBlockedStmt.run(blockerStr, blockedStr);
  },

  isBlocked: (blocker, blocked) => {
    const blockerStr = String(blocker);
    const blockedStr = String(blocked);
    const result = isBlockedStmt.get(blockerStr, blockedStr);
    console.log(`isBlocked check: blocker=${blockerStr}, blocked=${blockedStr}, result=`, result);
    return !!result;
  }
};