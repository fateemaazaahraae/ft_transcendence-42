import db from "../config/db.js";
import { nanoid } from "nanoid";

const stmts = {
  add: db.prepare(`INSERT OR IGNORE INTO friends (id, user_a, user_b, status) VALUES (?, ?, ?, 'pending')`),
  accept: db.prepare(`UPDATE friends SET status = 'accepted', updated_at = strftime('%s','now') WHERE (user_a = ? AND user_b = ?) OR (user_a = ? AND user_b = ?)`),
  reject: db.prepare(`DELETE FROM friends WHERE (user_a = ? AND user_b = ?) OR (user_a = ? AND user_b = ?)`),
  listAccepted: db.prepare(`SELECT * FROM friends WHERE (user_a = ? OR user_b = ?) AND status = 'accepted' ORDER BY updated_at DESC`),
  listPending: db.prepare(`SELECT * FROM friends WHERE user_b = ? AND status = 'pending' ORDER BY created_at DESC`),
  check: db.prepare(`SELECT 1 FROM friends WHERE (user_a = ? AND user_b = ?) OR (user_a = ? AND user_b = ?) AND status = 'accepted' LIMIT 1`)
};

export default {
  addFriend: (a, b) => { stmts.add.run(nanoid(), a, b); return { id: nanoid(), user_a: a, user_b: b, status: 'pending' }; },
  acceptFriend: (a, b) => stmts.accept.run(a, b, b, a),
  rejectFriend: (a, b) => stmts.reject.run(a, b, b, a),
  listFriends: (id) => stmts.listAccepted.all(id, id),
  listPending: (id) => stmts.listPending.all(id),
  isFriend: (a, b) => !!stmts.check.get(a, b, b, a)
};
