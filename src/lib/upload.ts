"use server";

import { uploadStreamOnCloudinary } from "./cloudinary";
import { UploadApiResponse } from "cloudinary";

export const uploadImagesToCloudinary = async (
  formData: FormData,
  names: string[]
): Promise<string[]> => {
  const imgUrls: string[] = [];
  await Promise.all(
    names.map(async (name) => {
      const file = formData.get(name) as File;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const result: UploadApiResponse | undefined =
        await uploadStreamOnCloudinary(buffer);
      if (result) {
        imgUrls.push(result.secure_url);
      }
    })
  );
  return imgUrls;
};
