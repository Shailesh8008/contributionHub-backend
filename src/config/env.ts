import dotenv from "dotenv";

dotenv.config();

export const env = {
  DB: process.env.DB as string,
  JWT: process.env.JWT_SECRET_KEY as string,
};

if (!env.DB) {
  throw new Error("❌ DB environment variable is missing");
}
