const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.CLOUD_KEY, 
  api_secret: process.env.CLOUD_SECRET,
});

const uploadStream = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );

    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};


module.exports.streamUpload = async (req, res, next) => {
  try {
    if (req.files?.thumbnail?.length) {
      const result = await uploadStream(req.files.thumbnail[0]);
      req.body.thumbnail = result.secure_url;
    }

    if (req.files?.images?.length) {
      const results = await Promise.all(
        req.files.images.map(file => uploadStream(file))
      );
      req.body.images = results.map(item => item.secure_url);
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: "Upload image failed"
    });
  }
};
