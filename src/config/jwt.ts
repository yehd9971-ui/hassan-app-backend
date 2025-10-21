// src/config/jwt.ts
export const JWT_EXPIRES_IN = "7d";

// ⚠️ HARD-CODED SECRET (مؤقت للتجريب فقط)
// بدّلها لاحقًا إلى env عند الجاهزية.
export const HARDCODED_JWT_SECRET =
  "pk_1eT1PH4eS8QbV9mX2Y7rG0cL5D3nF8tJ1K6wZ4aR2U9pC7sE0H5yM3vN8B6T2Q";

export function getJwtSecret(): string {
  // لا تعتمد على process.env هنا — نريد سرًا ثابتًا صريحًا الآن
  return HARDCODED_JWT_SECRET;
}
