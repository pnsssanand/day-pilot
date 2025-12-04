const CLOUD_NAME = "dlvjvskje";
const UPLOAD_PRESET = "daypilot";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
}

export const uploadToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        resolve({
          secure_url: response.secure_url,
          public_id: response.public_id,
          format: response.format,
          resource_type: response.resource_type,
        });
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    };

    xhr.onerror = () => reject(new Error("Upload failed"));
    xhr.send(formData);
  });
};

/*
 * Security Note:
 * This uses unsigned uploads with a preset for convenience during development.
 * For production, consider implementing signed uploads:
 * 1. Create a server endpoint that generates signed upload parameters
 * 2. Use the signature, timestamp, and api_key from your server
 * 3. This prevents abuse of your Cloudinary account
 * 
 * Example signed upload flow:
 * - Client requests upload signature from your server
 * - Server generates signature using your API secret (never exposed to client)
 * - Client uploads to Cloudinary with the signature
 */
