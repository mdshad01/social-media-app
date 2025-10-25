import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024, // ✅ Reduce to 30MB (more reliable)
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed!"), false);
    }
  },
});

export default upload;
