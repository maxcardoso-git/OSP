export default () => ({
  port: parseInt(process.env.PORT, 10) || 3001,
  
  database: {
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    database: process.env.DATABASE_NAME || "osp",
    schema: process.env.DATABASE_SCHEMA || "public",
    synchronize: process.env.DATABASE_SYNCHRONIZE || "false",
    logging: process.env.DATABASE_LOGGING || "false",
    ssl: process.env.DATABASE_SSL || "false",
  },

  tah: {
    baseUrl: process.env.TAH_BASE_URL || "https://tah.example.com",
    jwksUrl: process.env.TAH_JWKS_URL || "https://tah.example.com/.well-known/jwks.json",
    issuer: process.env.TAH_ISSUER || "https://tah.example.com",
    appId: process.env.TAH_APP_ID || "osp",
    appSecret: process.env.TAH_APP_SECRET,
    sessionCookieName: process.env.TAH_SESSION_COOKIE_NAME || "tah_session",
  },

  session: {
    secret: process.env.SESSION_SECRET || "change-this-secret-in-production",
    maxAge: parseInt(process.env.SESSION_MAX_AGE, 10) || 86400000,
    secure: process.env.SESSION_SECURE === "true",
    sameSite: process.env.SESSION_SAME_SITE || "lax",
  },

  cors: {
    origins: process.env.CORS_ORIGINS || "http://localhost:3000",
  },

  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
});
