import { betterAuth, socialProviders } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MONGODB_URI is not defined"); 
}

// Global cache to prevent multiple connections in Next.js dev
declare global {
    var _mongoClient: MongoClient | undefined;
}

if (!global._mongoClient) {
    global._mongoClient = new MongoClient(uri, {
        retryWrites: true,
        w: "majority",
    });
}

const client = global._mongoClient;

export const auth = betterAuth({
    database: mongodbAdapter(client.db(), {
        client,
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
    github: {
        clientId: "",
        clientSecret: "",
    }
    },
    google: {
        clientId: "",
        clientSecrets: "",
    }

});    






