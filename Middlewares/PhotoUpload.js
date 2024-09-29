const multer = require('multer');
const path = require('path');

// Set up multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder for uploads
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to the original filename
    }
});

const upload = multer({ storage: storage });

// Middleware to use in your routes
module.exports = upload;
