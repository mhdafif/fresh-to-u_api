// import jwt from "jsonwebtoken";

// import env from "../config/env.js";

// export interface JWTPayload {
//   id: string;
//   email: string;
//   seasonId: string;
// }

// export const generateAccessToken = (payload: JWTPayload): string => {
//   return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: "15m" });
// };

// export const generateRefreshToken = (payload: JWTPayload): string => {
//   return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
// };

// export const verifyAccessToken = (token: string): JWTPayload => {
//   return jwt.verify(token, env.JWT_ACCESS_SECRET) as JWTPayload;
// };

// export const verifyRefreshToken = (token: string): JWTPayload => {
//   return jwt.verify(token, env.JWT_REFRESH_SECRET) as JWTPayload;
// };
