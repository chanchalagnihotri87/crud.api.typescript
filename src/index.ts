import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { mongoConnect } from "./util/database.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "..");

import authRoutes from "../src/infrastructure/api/express/routes/auth.js";
import studentRoutes from "../src/infrastructure/api/express/routes/student.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
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
const upload = multer({ storage: storage, fileFilter: fileFilter });

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome in node & typescript api!");
});

app.use("/student", studentRoutes);

app.use("/auth", authRoutes);

//#endregion

//Database connection
mongoConnect(() => {
  app.listen(3000, () => {
    console.log("Your application is running");
  });
});
