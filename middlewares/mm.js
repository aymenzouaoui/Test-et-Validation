// Import necessary modules from the 'cloudinary' package
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dznvwntjn',
  api_key: '972319243848173',
  api_secret: 'xp2G8BXbjvjec0dbFIaQbUJ3Mj8',
  secure: true,
});

// Function to upload an image to Cloudinary
const uploadImage = async (imageData) => {
  try {
    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(imageData, { folder: 'pdm' });

    // Return the Cloudinary response
    return result;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

export { uploadImage };
