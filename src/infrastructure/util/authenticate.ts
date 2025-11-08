import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "thisismyjsonsecret";

interface ApiRequest extends Request {
  user: jwt.JwtPayload;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
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

export default authenticate;
