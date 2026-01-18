const CLOUD_NAME = "dk7wadukf";
const UPLOAD_PRESET = "kings_design_uploads";

const uploadImagesToCloudinary = async (files) => {
  const uploadedUrls = [];

  for (const item of files) {
    const file = item && item.file ? item.file : item;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary upload failed: ${response.status}`);
    }

    const data = await response.json();
    const optimizedUrl = data.secure_url.replace("/upload/", "/upload/q_auto,f_auto/");
    uploadedUrls.push(optimizedUrl);
  }

  return uploadedUrls;
};

export default uploadImagesToCloudinary;
