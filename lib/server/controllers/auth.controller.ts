import bcrypt from "bcryptjs";
import * as usersDal from "@/lib/server/dal/users.dal";
import * as sessionsDal from "@/lib/server/dal/sessions.dal";

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsError";
  }
}

const SALT_ROUNDS = 12;

// ─── Login ───────────────────────────────────────────────────────────────────

/**
 * Verify credentials, create a DB session, and return the raw token + redirect.
 * Throws on invalid credentials.
 */
export async function loginUser(email: string, password: string) {
  const user = await usersDal.getUserByEmail(email.toLowerCase().trim());
  if (!user) {
    throw new InvalidCredentialsError();
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new InvalidCredentialsError();
  }

  // Create DB session
  const { token } = await sessionsDal.createSession(user.id);

  // Compute redirect server-side (frontend never sees the role)
  const redirectTo = user.role === "ADMIN" ? "/dashboard" : "/";

  return {
    token,
    redirectTo,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

// ─── Register ────────────────────────────────────────────────────────────────

/**
 * Create a new CUSTOMER user, create a DB session, return token + redirect.
 * Role is always CUSTOMER — never trust client-provided role.
 */
export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const cleanEmail = email.toLowerCase().trim();
  const existing = await usersDal.getUserByEmail(cleanEmail);
  if (existing) {
    throw new Error("User with this email already exists");
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const newUser = await usersDal.createUser({
    name,
    email: cleanEmail,
    passwordHash,
    role: "CUSTOMER", // Always CUSTOMER — admin is provisioned separately
  });

  // Create DB session
  const { token } = await sessionsDal.createSession(newUser.id);

  return {
    token,
    redirectTo: "/",
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
  };
}

// ─── Logout ──────────────────────────────────────────────────────────────────

/**
 * Delete the session identified by the raw token's hash.
 */
export async function logoutUser(tokenHash: string) {
  await sessionsDal.deleteSession(tokenHash);
}
