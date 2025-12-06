"use server";

import { currentUser } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteImage, uploadResult } from "./cloudinary";
import prisma from "./db";
import { imageSchema, productSchema, validateWithZodSchema } from "./schemas";

export type CreateProductState = {
  message: string;
  success?: boolean;
};

const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) redirect("/");
  return user;
};

const getAdminUser = async () => {
  const user = await getAuthUser();
  if (user.id !== process.env.ADMIN_USER_ID) redirect("/");

  return user;
};

const renderError = (error: unknown): CreateProductState => ({
  message: error instanceof Error ? error.message : "There was an error...",
});

export const fetchFeaturedProducts = async () => {
  return prisma.product.findMany({
    where: { featured: true },
    orderBy: { createdAt: "desc" },
  });
};

export const fetchAllProducts = async ({ search = "" }: { search: string }) => {
  return prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });
};

export const fetchSingleProduct = async (productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) redirect("/products");
  return product;
};

export const createProductAction = async (
  prevState: CreateProductState,
  formData: FormData
): Promise<CreateProductState> => {
  try {
    const user = await getAuthUser();

    // Validate text inputs
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(productSchema, rawData);

    // Validate image
    const imageFile = formData.get("image") as File;
    validateWithZodSchema(imageSchema, { image: imageFile });

    const featured = Boolean(formData.get("featured"));

    // Upload image to Cloudinary
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imageUrl = await uploadResult(buffer);

    // Save product to DB
    await prisma.product.create({
      data: {
        ...validatedFields,
        image: imageUrl,
        featured,
        clerkId: user.id,
      },
    });

    return { message: "Product created", success: true };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchAdminProducts = async () => {
  await getAdminUser();
  return await prisma.product.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const deleteProductAction = async (prevState: { productId: string }) => {
  const { productId } = prevState;
  await getAdminUser();
  try {
    const product = await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    await deleteImage(product.image);
    revalidatePath("/admin/products");
    return { message: "product removed" };
  } catch (error) {
    return renderError(error);
  }
};

export const fetchAdminProductDetails = async (productId: string) => {
  await getAdminUser();
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
  });
  if (!product) redirect("/admin/products");
  return product;
};

export const updateProductAction = async (
  prevState: CreateProductState,
  formData: FormData
) => {
  await getAdminUser();

  try {
    const productId = formData.get("id") as string;
    const rawData = Object.fromEntries(formData);
    const validatedFields = validateWithZodSchema(productSchema, rawData);

    await prisma.product.update({
      where: {
        id: productId,
      },
      data: { ...validatedFields },
    });
    revalidatePath(`/admin/products/${productId}/edit`);
    return { message: "Product updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};
export const updateProductImageAction = async (
  prevState: CreateProductState,
  formData: FormData
) => {
  try {
    await getAuthUser();
    const image = formData.get("image") as File;
    const productId = formData.get("id") as string;
    const oldImageUrl = formData.get("url") as string;

    validateWithZodSchema(imageSchema, { image });

    console.log(image, productId, oldImageUrl);

    // Upload image to Cloudinary
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imageUrl = await uploadResult(buffer);
    await deleteImage(oldImageUrl);
    await prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        image: imageUrl,
      },
    });
    revalidatePath(`/admin/products/${productId}/edit`);
    return { message: "Product Image updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};
