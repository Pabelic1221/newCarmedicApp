import { Cloudinary } from "@cloudinary/url-gen";
import { upload } from "cloudinary-react-native";

/**
 * Configures the Cloudinary instance
 */
const cloudinary = new Cloudinary({
  cloud: {
    cloudName: "ds0znvcbn",
    apiKey: 852191926298842,
    apiSecret: "faRFvT87DEoSpRi9lQMG4w-nyFc",
  },
  url: {
    secure: true, // Enable HTTPS
  },
});

/**
 * Uploads an image to Cloudinary.
 * @param {string} imageUri - The local URI of the image to be uploaded.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 * @throws Will throw an error if the upload fails.
 */
export const uploadImageToCloudinary = async (imageUri) => {
  try {
    if (!imageUri) {
      throw new Error("Invalid image URI provided.");
    }
    console.log("Uploading image to Cloudinary:", imageUri);
    let secureURL;
    await upload(cloudinary, {
      file: imageUri,
      options: {
        upload_preset: "carmedic",
      },

      callback: (error, response) => {
        if (error) {
          console.error("Upload error:", error);
        } else {
          console.log("Upload successful. Response:", response);
          secureURL = response.secure_url;
        }
      },
    });
    console.log("Cloudinary upload successful. Response:", secureURL);
    return secureURL;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
};
