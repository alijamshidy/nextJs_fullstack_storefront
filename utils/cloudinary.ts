import { v2 as cloudinary } from "cloudinary";
// -----------------------------------------------------
// Cloudinary Setup
// -----------------------------------------------------
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
