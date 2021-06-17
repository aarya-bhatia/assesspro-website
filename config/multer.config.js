const multer = require("multer")
const path = require('path')

// setup multer
const imageStorage = multer.diskStorage({

    // Destination to store image     
    destination: path.join(__dirname, '../public/images/uploads'),

    filename: (req, file, cb) => {

        const filename = req.user._id + '_' + String(new Date()) +
            '_' + path.extname(file.originalname)
        console.log('Saving image as: ', filename)

        cb(null, filename)
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000 // 1000000 Bytes = 1 MB
    },

    fileFilter(req, file, cb) {

        // upload only png and jpg format
        if (!file.originalname.toLowerCase().match(/\.(png|jpg)$/)) {
            return cb(new Error('Please upload a Image'))
        }

        cb(null, true)
    }
})

module.exports = imageUpload;