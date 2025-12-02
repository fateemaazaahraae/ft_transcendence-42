import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { openDb } from "./db.js";


export async function createUser(firstName, lastName, userName, email, password, profileImage) {
  const db = await openDb();
  const passwordHash = await bcrypt.hash(password, 10);
  const id = uuidv4();

  await db.run(
    `INSERT INTO users(id, firstName, lastName, userName, email, passwordHash, isTwoFactorEnabled, profileImage)
      VALUES(?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, firstName, lastName, userName, email, passwordHash, 0, profileImage]
  );
  return {id, firstName, lastName, userName, email, passwordHash, profileImage};
}

export async function findUserByEmail(email) {
  const db = await openDb();
  return db.get(`SELECT * FROM users WHERE email = ?`, [email]);
}

export async function findUserByUserName(userName)
{
  const db = await openDb();
  return db.get(`SELECT * FROM users WHERE userName = ?`, [userName]);
}

// Update avatar
export async function updateAvatar(userId, profileImage) {
  const db = await openDb();
  await db.run(`UPDATE users SET profileImage = ? WHERE id = ?`, [profileImage, userId]);

}

// Find user by id
export async function findUserById(userId) {
  const db = await openDb();
  return db.get(`SELECT * FROM users WHERE id = ?`, [userId]);
}

