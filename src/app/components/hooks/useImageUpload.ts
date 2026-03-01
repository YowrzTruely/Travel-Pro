import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useImageUpload() {
  const generateUploadUrl = useMutation(api.images.generateUploadUrl);

  const upload = async (file: File): Promise<string> => {
    const url = await generateUploadUrl();
    const result = await fetch(url, {
      method: "POST",
      body: file,
      headers: { "Content-Type": file.type },
    });
    const { storageId } = await result.json();
    return storageId;
  };

  return { upload };
}
