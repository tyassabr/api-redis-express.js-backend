const multer    = require('multer')
const path      = require('path')

// how to create file storage
const multerStorage = multer.diskStorage ({
    destination: (req, file, cb) => {
        cb(null, './public/images' )
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`)
    }
})

// how to connect multer with file storage
const multerUpload = multer ({
    storage: multerStorage,
    limits: { fieldSize : 1 * 1000 * 1000 },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if(ext === '.png' || ext === '.jpg') {
            cb(null, true)
        } else {
            cb({error: 'Error type file!'}, false)
        }
    }
})

// middleware multer
const singleUpload = (req, res, next) => {
    // how to upload singleUpload with multer
    const multerSingle = multerUpload.single('image')
    multerSingle (req, res, (err) => {
       if(err) {
           res.json({
               message  : 'Error images upload!',
               error    : err
           })
       } else {
           next()
       } 
    })
}

module.exports = singleUpload