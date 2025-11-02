import jwt from "jsonwebtoken";
import IUseCase from "../../interfaces/useCase.js";

const JWT_SECRET = "thisismyjsonsecret";

export default class SignIn implements IUseCase<string> {
  call(payload: { username: string; password: string }): string {
    const { username, password } = payload;

    const JWT_EXPIRES_IN = "24h";

    if (username != "chanchalgnihotri" || password != "chanchal") {
      throw new Error("username or password not correct.");
    }

    const jwtToken = jwt.sign(
      {
        id: 10,
        username: "chanchalgnihotri",
        email: "chanchalagnihotri1987@gmail.com",
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
      }
    );

    return jwtToken;
  }
}
