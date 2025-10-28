import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  passwordHash: string;
}

// Simple in-memory user store
export const users = new Map<string, User>();

// Helper to create a new user
export async function createUser(firstName: string, lastName: string, userName: string, email: string, password: string): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 10);
  const user: User = { id: uuidv4(), firstName, lastName, userName, email, passwordHash };
  users.set(email, user);
  return user;
}
