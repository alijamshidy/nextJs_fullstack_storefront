"use server";
import { currentUser } from "@clerk/nextjs/server";
import { v2 as cloudinary } from "cloudinary";
import { redirect } from "next/navigation";
import prisma from "./db";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};
const getAuthUser = async () => {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }
  return user;
};
const renderError = (error: unknown): { message: string } => {
  console.log(error);
  return {
    message: error instanceof Error ? error.message : "there was an error...",
  };
};
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
export type CreateProductState = {
  message: string;
  success?: boolean;
};

export const createProductAction = async (
  prevState: CreateProductState,
  formData: FormData
): Promise<CreateProductState> => {
  const user = await getAuthUser();
  try {
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const price = Number(formData.get("price") as string);
    const imageFile = formData.get("image") as File;
    const description = formData.get("description") as string;
    const featured = Boolean(formData.get("featured") as string);

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadResult = await new Promise<CloudinaryUploadResult>(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "storeFront",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as CloudinaryUploadResult);
          }
        );
        uploadStream.end(buffer);
      }
    );

    const imageUrl = uploadResult.secure_url;

    await prisma.product.create({
      data: {
        name,
        company,
        price,
        image: imageUrl,
        description,
        featured,
        clerkId: user.id,
      },
    });
    return { message: "product created" };
  } catch (error) {
    return renderError(error);
  }
};
