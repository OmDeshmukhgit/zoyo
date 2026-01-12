import jwt, { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET || "fallback_secret_key";
const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN || "7d";

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as SignOptions);
}
