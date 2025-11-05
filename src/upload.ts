import { Request } from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  //We can check for mime type or other checks
  if (file) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

//USE CASE 1: Use default callback which will be called on every request
// app.use(
//   multer({ storage: storage, fileFilter: fileFilter }).single("PhotoFile")
// );

//USE CASE 2: Use conditional callback which can be integrated on required callback.
export const upload = multer({ storage: storage, fileFilter: fileFilter });
