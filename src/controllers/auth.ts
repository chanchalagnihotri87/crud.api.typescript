import IRequest from "../interfaces/request.js";
import IUseCase from "../interfaces/useCase.js";

export default class AuthController {
  constructor(private signInUseCase: IUseCase<string>) {}
  async signIn(request: IRequest) {
    return this.signInUseCase.call(request.body);
  }
}
