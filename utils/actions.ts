"use server";
import db from "@/utils/db";
export const fetchFeaturedProducts = async () => {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
  });
  // await new Promise(resolve => setTimeout(resolve, 5000));
  return products;
};
export const fetchAllProducts = async () => {
  const allProducts = await db?.product?.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return allProducts;
};
