import { redirect } from "next/navigation";
import prisma from "./db";

export const fetchFeaturedProducts = async () => {
  const products = await prisma?.product?.findMany({
    where: {
      featured: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return products;
};
export const fetchAllProducts = async ({ search = "" }: { search: string }) => {
  const allProducts =
    (await prisma?.product?.findMany({
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

export const fetchSingleProduct = async (productId: string) => {
  const product = await prisma?.product?.findUnique({
    where: { id: productId },
  });
  if (!product) {
    redirect(`/products`);
  }

  return product;
};
