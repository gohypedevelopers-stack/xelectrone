import bcrypt from "bcryptjs";
import * as usersDal from "@/lib/server/dal/users.dal";

export async function loginUser(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await usersDal.getUserByEmail(email.toLowerCase().trim());
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Return user data without password hash
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}
