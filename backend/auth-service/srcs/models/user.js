import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { openDb } from "./db.js";


// Helper to create a new user
export async function createUser(firstName, lastName, userName, email, password) {
  const db = await openDb();
  const passwordHash = await bcrypt.hash(password, 10);
  const id = uuidv4();

  await db.run(
    `INSERT INTO users(id, firstName, lastName, userName, email, passwordHash)
      VALUES(?, ?, ?, ?, ?, ?)`,
      [id, firstName, lastName, userName, email,passwordHash]
  );
  return {id, firstName, lastName, userName, email, passwordHash};
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