require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET, // Click 'View Credentials' below to copy your API secret
});
let streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(buffer).pipe(stream);
  });
};
module.exports = async (buffer) => {
  try {
    let result = await streamUpload(buffer);
    return result.url;
  } catch (error) {
    console.error("Upload error:", error);
    // You can send an error response here if needed
    res.status(500).send({ error: "Upload failed", details: error });
  }
};
