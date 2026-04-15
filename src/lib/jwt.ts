// src/lib/jwt.ts
import jwt from "jsonwebtoken";

export const signToken = (payload: any) =>
  jwt.sign(payload, process.env.JWT_SECRET || "paarsh_super_secret_key_123", {
    expiresIn: "1d",
  });

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET || "paarsh_super_secret_key_123");
