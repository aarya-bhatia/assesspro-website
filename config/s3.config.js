const path = require("path");
const fs = require("fs");
const aws = require("aws-sdk");
const s3 = new aws.S3();

const bucket = process.env.AWS_BUCKET_NAME;
// const region = process.env.AWS_BUCKET_REGION;
// const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
// const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

// aws.config.update({
//   secretAccessKey,
//   accessKeyId,
//   region,
// });

const fileFilter = function (req, file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Allow images only of extensions jpeg|jpg|png !");
  }
};

const multer = require("multer");
const multerS3 = require("multer-s3");

const storage = multerS3({
  s3,
  bucket,
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    console.log(file);
    cb(null, new Date().toISOString());
  },
});

const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 7, // 7 MB
  },
});

module.exports.uploadImage = uploadImage;

module.exports.upload = function (file) {
  const fileStream = fs.createReadStream(file.path);
  const param = {
    Bucket: bucket,
    Body: fileStream,
    Key: new Date().toISOString(),
  };

  return s3.upload(param).promise();
};

module.exports.downloadImage = function (key) {
  const param = {
    Key: key,
    Bucket: bucket,
  };

  return s3.getObject(param).createReadStream();
};
