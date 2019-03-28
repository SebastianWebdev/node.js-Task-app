const multer = require('multer')
const upload = multer({
    limits: {
        fileSize: 1048576
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|png|jpeg)/)) {
            return cb(new Error("Please upload a jpg,png or jpeg file"))
        }
        cb(undefined, true)
    }
})
module.exports = upload