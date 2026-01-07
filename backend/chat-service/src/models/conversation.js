import db from "../config/db.js"
import { nanoid } from "nanoid";

const stmts = {
  find: db.prepare(`SELECT * FROM conversations WHERE (user_a = ? AND user_b = ?) OR (user_a = ? AND user_b = ?)`),
  create: db.prepare(`INSERT INTO conversations (id, user_a, user_b) VALUES (?, ?, ?)`),
  listUser: db.prepare(`SELECT * FROM conversations WHERE user_a = ? OR user_b = ? ORDER BY created_at DESC`)
};

export default {
  findOrCreate: (a, b) => {
    let conv = stmts.find.get(a, b, b, a);
    if (conv) return conv;
    const id = nanoid();
    stmts.create.run(id, a, b);
    return { id, user_a: a, user_b: b };
  },
  listForUser: (userId) => stmts.listUser.all(userId, userId)
};