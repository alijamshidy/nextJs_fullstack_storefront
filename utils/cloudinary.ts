import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET!,
});
type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

export async function uploadResult(buffer: object): Promise<string> {
  const uploadResult = await new Promise<CloudinaryUploadResult>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "storeFront",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as CloudinaryUploadResult);
        }
      );

      uploadStream.end(buffer);
    }
  );
  return uploadResult.secure_url;
}

type CloudinaryDeleteResult = {
  result: string;
};
export function getPublicIdFromUrl(url: string): string {
  const cleanedUrl = url.split("?")[0];

  const parts = cleanedUrl.split("/upload/");
  if (parts.length < 2) {
    throw new Error("Invalid Cloudinary URL");
  }

  let path = parts[1];

  path = path.replace(/^v[0-9]+\//, "");

  path = path.replace(/\.[^/.]+$/, "");

  return path;
}

export async function deleteImage(
  imageUrl: string
): Promise<CloudinaryDeleteResult> {
  const publicId = await getPublicIdFromUrl(imageUrl);
  console.log(publicId);
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return result;
  } catch (err) {
    console.error("Delete error:", err);
    throw err;
  }
}
