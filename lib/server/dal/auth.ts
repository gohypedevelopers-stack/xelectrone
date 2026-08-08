import { db } from "@/lib/db";

export async function requireAdmin() {
  // TODO: Implement proper admin check with session/JWT
  // For now, returns true for development
  return true;
}

export async function getUserCount() {
  return db.user.count();
}
