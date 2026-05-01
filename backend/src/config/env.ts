import dotenv from "dotenv";

dotenv.config();

// ─── Validate all required environment variables on startup ───
const requiredEnvVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "CLIENT_URL",
] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(
      `❌ Missing required environment variable: ${envVar}. Check your .env file.`
    );
  }
}

// ─── Export typed config object ───────────────────────────────
export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV === "development",

  db: {
    url: process.env.DATABASE_URL as string,
  },

  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  },

  cors: {
    clientUrl: process.env.CLIENT_URL as string,
  },

  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY || "",
    openaiApiKey: process.env.OPENAI_API_KEY || "",
  },
} as const;