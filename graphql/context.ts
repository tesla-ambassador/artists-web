import { prisma } from "../lib/db";
import { NextRequest } from "next/server";

export interface Context {
  prisma: typeof prisma;
}

export async function createContext(req: NextRequest): Promise<Context> {
  return {
    prisma,
  };
}
