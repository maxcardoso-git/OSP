export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'osp_dev',
  },
  tah: {
    publicKeyUrl: process.env.TAH_PUBLIC_KEY_URL || 'https://auth.tah.app/.well-known/jwks.json',
    issuer: process.env.TAH_ISSUER || 'https://auth.tah.app',
    audience: process.env.TAH_AUDIENCE || 'osp',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
});
