import bcrypt from "bcryptjs";
import * as usersDal from "@/lib/server/dal/users.dal";

const SALT_ROUNDS = 12;

// ─── Register ────────────────────────────────────────────────────────────────

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role?: "ADMIN" | "CUSTOMER";
  phone?: string;
}) {
  if (!data.name || !data.email || !data.password) {
    throw new Error("Missing required fields: name, email, password");
  }

  // Check duplicate email
  const existing = await usersDal.getUserByEmail(data.email);
  if (existing) {
    throw new Error("A user with this email already exists");
  }

  // Validate password strength
  if (data.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  return usersDal.createUser({
    name: data.name,
    email: data.email.toLowerCase().trim(),
    passwordHash,
    role: data.role,
    phone: data.phone,
  });
}

// ─── List ────────────────────────────────────────────────────────────────────

export async function listUsers() {
  return usersDal.getAllUsers();
}

// ─── Get One ─────────────────────────────────────────────────────────────────

export async function getUser(id: string) {
  const user = await usersDal.getUserById(id);
  if (!user) throw new Error("User not found");
  return user;
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateUser(
  id: string,
  data: { name?: string; email?: string; phone?: string }
) {
  const existing = await usersDal.getUserById(id);
  if (!existing) throw new Error("User not found");
  return usersDal.updateUser(id, data);
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteUser(id: string) {
  const existing = await usersDal.getUserById(id);
  if (!existing) throw new Error("User not found");
  return usersDal.deleteUser(id);
}
