// JWT Configuration
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// ⚠️ سرّ ثابت داخل الكود (مطلوب حاليًا). غيّره لاحقًا إلى env.
const HARDCODED_JWT_SECRET =
  "pk_1eT1PH4eS8QbV9mX2Y7rG0cL5D3nF8tJ1K6wZ4aR2U9pC7sE0H5yM3vN8B6T2Q";

export function getJwtSecret(): string {
  return process.env.JWT_SECRET || HARDCODED_JWT_SECRET;
}

// JWT Options with clock tolerance
export const JWT_OPTIONS = {
  expiresIn: JWT_EXPIRES_IN,
  clockTolerance: 60 // 60 seconds tolerance for clock differences
};

// Verify JWT with proper error handling
export function verifyJwtToken(token: string): any {
  const jwt = require('jsonwebtoken');
  try {
    return jwt.verify(token, getJwtSecret(), { clockTolerance: 60 });
  } catch (error) {
    throw new Error((error as Error).message || 'TOKEN_INVALID');
  }
}

// Sign JWT with proper options
export function signJwtToken(payload: any): string {
  const jwt = require('jsonwebtoken');
  return jwt.sign(payload, getJwtSecret(), JWT_OPTIONS);
}
