export default async function useCloudinaryUpload(image, name) {
  const CLOUDINARY_UPLOAD_PRESET =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  try {
    const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    const res = () =>
      new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          const mimeType = result.split(",")[0].split(":")[1].split(";")[0];
          const base64Data = result.split(",")[1];
          resolve({ base64Data, mimeType });
        };
        reader.readAsDataURL(image);
      });

    const { base64Data, mimeType } = await res();

    const formData = new FormData();
    formData.append("file", `data:${mimeType};base64,${base64Data}`);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("public_id", name || image.fileName || crypto.randomUUID());

    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    console.log(result);
    if (result.secure_url) {
      return result.secure_url;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error.message);
  }
}
