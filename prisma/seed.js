import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import pkg from "pg";
const { Pool } = pkg;

import products from "./products.json" with { type: "json" };

// ساخت pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ساخت Adapter
const adapter = new PrismaPg(pool);

// PrismaClient با adapter
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
