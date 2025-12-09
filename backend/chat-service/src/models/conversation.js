import db from "../config/db.js"
import { nanoid } from "nanoid";

const findConversationStmt = db.prepare(
  `SELECT * FROM conversations
   WHERE (user_a = ? AND user_b = ?) OR (user_a = ? AND user_b = ?)`
);

const createConversationStmt= db.prepare(
     `INSERT INTO conversations (id, user_a, user_b) VALUES (?, ?, ?)`

);

export default{
    findOrCreate:(a,b)=>{
        const existing =findConversationStmt.get(a,b,b,a);
        if(existing) return existing;
        const id=nanoid();
        createConversationStmt.run(id, a, b);
        return { id, user_a: a, user_b: b };
    },

    listForUser:(userId)=>{
        return db.prepare(
               `SELECT * FROM conversations WHERE user_a = ? OR user_b = ? ORDER BY created_at DESC`
        ).all(userId,userId);
    }
};