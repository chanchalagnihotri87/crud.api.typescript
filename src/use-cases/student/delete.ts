import IStudentRepository from "../../infrastructure/data-access/interfaces/IStudentRepository.js";
import IUseCase from "../../interfaces/useCase.js";

export default class DeleteStudent implements IUseCase<boolean> {
  constructor(protected studentRepo: IStudentRepository) {}

  async call(studentId: string): Promise<boolean> {
    var deleteResult = await this.studentRepo.deletesync(studentId);

    return deleteResult.deletedCount > 0;
  }
}
