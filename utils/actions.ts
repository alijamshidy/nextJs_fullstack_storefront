"use server";
import db from "@/utils/db";
export const fetchFeaturedProducts = async () => {
  const products = await db?.product?.findMany({
    where: {
      featured: true,
    },
  });
  // await new Promise(resolve => setTimeout(resolve, 5000));
  return products;
};
export const fetchAllProducts = async ({ search = "" }: { search: string }) => {
  const allProducts =
    (await db?.product?.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    })) || [];
  return allProducts;
};
