import mongoose from "mongoose";

export async function connectDb(mongoUri) {
  if (!mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
}

export function getDbStatus() {
  const states = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const readyState = mongoose.connection.readyState;

  return {
    readyState,
    state: states[readyState] || "unknown",
  };
}
