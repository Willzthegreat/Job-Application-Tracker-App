import { auth, ensureMongoConnection } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

async function withMongoConnection(request: Request, handler: (request: Request) => Promise<Response>) {
  await ensureMongoConnection();
  return handler(request);
}

export async function GET(request: Request) {
  return withMongoConnection(request, handlers.GET);
}

export async function POST(request: Request) {
  return withMongoConnection(request, handlers.POST);
}

export async function PATCH(request: Request) {
  return withMongoConnection(request, handlers.PATCH);
}

export async function PUT(request: Request) {
  return withMongoConnection(request, handlers.PUT);
}

export async function DELETE(request: Request) {
  return withMongoConnection(request, handlers.DELETE);
}
