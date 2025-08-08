import multer from "multer";

const storage = multer.memoryStorage(); // Files will be stored in memory as Buffer

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
}); // Multer instance using memory storage

export default upload;
