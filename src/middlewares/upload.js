const multer = require ('multer');
const path = require('path');

console.log(__dirname)

const publicDir = path.join(__dirname, '../../public')
const uploadDir = path.join(publicDir, 'uploads')

const memoryStorage = multer.memoryStorage();
const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname+'-'+uniqueSuffix+path.extname(file.originalname));
    }
})

module.exports = {
memory:multer({storage:memoryStorage}),
disk:multer({storage:diskStorage})}