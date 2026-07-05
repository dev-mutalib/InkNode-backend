import multer from 'multer';

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images file are allowed'), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fieldSize: 2 * 1024 * 1024 },
});

const uploadAvatar = upload.single('avatar');

export default uploadAvatar;
