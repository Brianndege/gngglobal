import { prisma } from "./prisma.js";

let connectionState = "disconnected";

function resolveDatabaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.NETLIFY_DATABASE_URL ||
    process.env.NETLIFY_DATABASE_URL_UNPOOLED ||
    ""
  ).trim();
}

export async function connectDb() {
  const databaseUrl = resolveDatabaseUrl();

  if (!databaseUrl) {
    throw new Error("DATABASE_URL (or NETLIFY_DATABASE_URL) is required");
  }

  process.env.DATABASE_URL = databaseUrl;

  connectionState = "connecting";

  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;
    connectionState = "connected";
  } catch (error) {
    connectionState = "disconnected";
    throw error;
  }
}

export function getDbStatus() {
  const stateMap = {
    disconnected: 0,
    connected: 1,
    connecting: 2,
    disconnecting: 3,
  };

  return {
    readyState: stateMap[connectionState] ?? -1,
    state: connectionState,
  };
}
