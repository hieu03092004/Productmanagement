const multer  = require('multer');
module.exports = () =>{
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, './public/uploads')
          //thu muc ban muon luu no vao
        },
        filename: function (req, file, cb) {
          const uniqueSuffix = Date.now() ;
          //Date.now thoi gian hien tai
          cb(null,`${uniqueSuffix}-${file.originalname}`);
          //cb(null,tenfile muon luu)
        }
      })
      return storage;
}