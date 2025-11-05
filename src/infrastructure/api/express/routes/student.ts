import express, { NextFunction, Request, Response } from "express";
import * as fs from "fs";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import StudentController from "../../../../controllers/student.js";
import CreateUser from "../../../../use-cases/student/creat.js";
import DeleteStudent from "../../../../use-cases/student/delete.js";
import GetStudent from "../../../../use-cases/student/get.js";
import GetAllStudents from "../../../../use-cases/student/getAll.js";
import UpdateStudent from "../../../../use-cases/student/update.js";
import { downloadBlob, uploadFile } from "../../../../util/azurefilestorage.js";
import container from "../../../dependency-injection/alwx/container.js";

const studentController = new StudentController(
  new CreateUser(container.cradle.StudentRepository),
  new UpdateStudent(container.cradle.StudentRepository),
  new DeleteStudent(container.cradle.StudentRepository),
  new GetAllStudents(container.cradle.StudentRepository),
  new GetStudent(container.cradle.StudentRepository)
);

const JWT_SECRET = "thisismyjsonsecret";

interface ApiRequest extends Request {
  user: jwt.JwtPayload;
}

const authenticateToken = (
  req: ApiRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  console.log("authorization header:");
  console.log(authHeader);

  let token = authHeader && authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).send({ message: "Access token is required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({ message: "Invalid token" });
    }

    req.user = user as jwt.JwtPayload;
    next();
  });
};

//#region  Storage With Multer
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
const upload = multer({ storage: storage, fileFilter: fileFilter });

//#endregion

const router = express.Router();

router.get("/getAll", async (req: Request, res: Response) => {
  console.log("Calling from route file");
  let pageNo = parseInt(req.query.pageNo?.toString() ?? "1") ?? 1;

  const pageSize = 10;

  const { records, totalPages } = await studentController.getAll(
    pageNo,
    pageSize
  );
  res.send({
    students: records,
    pageNo: pageNo,
    totalPages: totalPages,
  });
});

router.get("/get/:id", async (req: Request, res: Response) => {
  const studentId = req.params.id!;

  const student = await studentController.get(studentId);

  res.send(student);
});

router.post(
  "/add",
  upload.single("photoFile"),
  async (req: Request, res: Response) => {
    if (req.file) {
      await saveFile(req);

      const photo = req.file!.filename;
      req.body.photo = photo;
    }

    console.log("Going to create student with student controller.");

    await studentController.create(req);

    console.log("Created student with student controller.");

    res.send({});
  }
);

const saveFile = async (req: Request) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.resolve(path.dirname(__filename), "../../../../../");

  console.log("__dirname:");
  console.log(__dirname);
  const sourceFile = path.join(
    __dirname,
    req.file!.destination,
    req.file!.filename
  );
  const host = req.hostname; // or req.ip

  if (host === "localhost" || host === "127.0.0.1") {
    const destinationFile = path.join(
      __dirname,
      "public",
      "images",
      "students",
      req.file!.filename
    );

    fs.rename(sourceFile, destinationFile, (err) => {
      if (err) {
        console.log("Error occured while moving file to student directory");
        console.log(err);
        throw err;
      }

      //When no error occured
    });
  } else {
    console.log("Going to upload file to azure storage");
    await uploadFile("images", req.file!.filename, sourceFile);
    console.log("Uploaded file to azure storage");
  }
};

router.get("/image/:fileName", async (req: Request, res: Response) => {
  const fileName = req.params.fileName!;

  const host = req.hostname;

  if (host === "localhost" || host === "127.0.0.1") {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.resolve(path.dirname(__filename), "../../../../../");
    const filePatch = path.join(
      __dirname,
      "public",
      "images",
      "students",
      fileName
    );

    res.sendFile(filePatch);
  } else {
    const blobBuffer = await downloadBlob("images", fileName);

    res.setHeader("Content-Type", "image/jpeg"); // Adjust content type as needed
    res.send(blobBuffer);
  }
});

router.put(
  "/update",
  upload.single("photoFile"),
  async (req: Request, res: Response) => {
    if (req.file) {
      await saveFile(req);
      req.body.photo = req.file!.filename;
    }

    req.body._id = ObjectId.createFromHexString(req.body.studentId);

    const success = await studentController.update(req);

    res.send({ success });
  }
);

router.delete("/delete/:id", async (req: Request, res: Response) => {
  const studentId = req.params.id!;
  await studentController.delete(studentId);
  res.send({});
});

export default router;
