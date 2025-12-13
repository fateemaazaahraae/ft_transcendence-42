import db from "../config/db.js";
import { nanoid } from "nanoid";

const str = (val) => String(val);
const stmts = {
  insert: db.prepare(`INSERT OR IGNORE INTO blocked_users (id, blocker_id, blocked_id, created_at) VALUES (?, ?, ?, strftime('%s','now'))`),
  check: db.prepare(`SELECT 1 FROM blocked_users WHERE blocker_id = ? AND blocked_id = ? LIMIT 1`),
  delete: db.prepare(`DELETE FROM blocked_users WHERE blocker_id = ? AND blocked_id = ?`)
};

export default {
  block: (blocker, blocked) => {
    const [b1, b2] = [str(blocker), str(blocked)];
    stmts.insert.run(nanoid(), b1, b2);
    return { id: nanoid(), blocker_id: b1, blocked_id: b2 };
  },
  unblock: (blocker, blocked) => stmts.delete.run(str(blocker), str(blocked)),
  isBlocked: (blocker, blocked) => !!stmts.check.get(str(blocker), str(blocked))
};