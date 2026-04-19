import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = global._mongoClient ?? new MongoClient(uri);

if (!global._mongoClient) {
  global._mongoClient = client;
}

export async function ensureMongoConnection() {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect().finally(() => {
      global._mongoClientPromise = undefined;
    });
  }

  await global._mongoClientPromise;
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(client.db(), {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
