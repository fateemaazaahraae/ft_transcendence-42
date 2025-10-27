import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

// Simple in-memory user store
export const users = new Map();

// Helper to create a new user
export async function createUser(firstName, lastName, userName, email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  // Create user object
  const user = {
    id: uuidv4(),
    firstName,
    lastName,
    userName,
    email,
    passwordHash
  };

  users.set(email, user);

  return user;
}
