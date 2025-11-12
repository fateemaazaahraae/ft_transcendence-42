import { openDb } from "./db.js"

export async function save2FACode(userId, Code, ExpireDate) {
  const db = await openDb();
  await db.run(
    "INSERT INTO user_2fa (user_id, code, expire_date) VALUES (?, ?, ?)",
    [userId, Code, ExpireDate]
  );
}

export async function get2FACode(userId) {
    const db = await openDb();
    const row = await db.get(
      `SELECT * FROM user_2fa
      WHERE user_id = ?
      ORDER BY expire_date DESC
      LIMIT 1`,
      [userId]
    );
    return row;
}

export async function delete2FACode(userId) {
  const db = await openDb();
  await db.run(
    "DELETE FROM user_2fa WHERE user_id = ?", [userId]
  )
}