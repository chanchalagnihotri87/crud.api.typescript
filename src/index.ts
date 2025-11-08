import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./infrastructure/api/express/routes/auth.js";
import studentRoutes from "./infrastructure/api/express/routes/student.js";
import { mongoConnect } from "./infrastructure/util/database.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "..");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.get("/home", (req: Request, res: Response) => {
  res.send("Welcome in node & typescript api!");
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome in node & typescript api!");
});

app.use("/student", studentRoutes);

app.use("/auth", authRoutes);

//#endregion

//Database connection
mongoConnect(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Your application is running");
  });
});
