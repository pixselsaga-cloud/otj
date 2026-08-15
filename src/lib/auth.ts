import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET_STRING = process.env.JWT_SECRET || "otj_super_secret_jwt_key_2026_luxury_studio_a3e635_9876543210";
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export interface AuthSession {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(session: AuthSession): Promise<string> {
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: (payload.role as string) || "ADMIN",
    };
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<AuthSession | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("otj_session")?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function authenticateRequest(req: NextRequest): Promise<AuthSession | null> {
  const token = req.cookies.get("otj_session")?.value;
  if (!token) return null;
  return await verifySessionToken(token);
}
