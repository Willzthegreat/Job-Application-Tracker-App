import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/job-board";

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

declare global {
  var _mongoClient: MongoClient | undefined;
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const client = global._mongoClient ?? new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

if (!global._mongoClient) {
  global._mongoClient = client;
}

export async function ensureMongoConnection() {
  // Check if topology exists and is connected
  if (client.topology?.isConnected()) {
    return; // Already connected
  }
  
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          if (user.id) {
            await initializeUserBoard(user.id);
          }
        }
      }
    }
  }
});


export async function getSession() {
  const result = await auth.api.getSession({
    headers: await headers()
  });

  return result;
}

export async function signOut() {
  const result = await auth.api.signOut({
    headers: await headers()
  });

  if (result.success) {
    redirect("/pages/sign-in");
  }

}
export async function initializeUserBoard(_id: string) {
  throw new Error("Function not implemented.");
}





