import { openDb } from "./db.js";

export async function saveResetToken(userId, token, expireAt) {
  const db = await openDb();
  await db.run(`DELETE FROM forget_pass WHERE user_id = ?`, [userId]);

  await db.run(
    `INSERT INTO forget_pass (user_id, resetToken, resetTokenExpire) VALUES (?, ?, ?)`,
    [userId, token, expireAt]
  );
}

export async function findUserByResetToken(token) {
  const db = await openDb();
  return db.get(`SELECT * FROM forget_pass WHERE resetToken = ?`, [token]);
}

export async function updatePassword(userId, password) {
  const db = await openDb();
  await db.run(
    `UPDATE users SET passwordHash = ? WHERE id = ?`,
    [password, userId]
  );

  await db.run(`DELETE FROM forget_pass WHERE user_id = ?`, [userId]);
}
