import express from "express";
import AuthController from "../../../../controllers/auth.js";
import SignIn from "../../../../use-cases/auth/signin.js";

const router = express.Router();

const authController = new AuthController(new SignIn());

router.post("/login", async (req, res) => {
  const jwtToken = await authController.signIn(req);
  res.send({ token: jwtToken });
});

export default router;
