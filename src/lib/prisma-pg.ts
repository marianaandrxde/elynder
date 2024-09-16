import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
/**
 * Gera uma instância do banco de dados com o adaptador serverless Neon
 */
export function PrismaGetInstance(): PrismaClient {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL});
  const adapter = new PrismaNeon(pool);
  const prisma = new PrismaClient({ adapter });

  return prisma;
}