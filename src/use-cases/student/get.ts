import Student from "../../entities/student.js";
import IStudentRepository from "../../infrastructure/data-access/interfaces/IStudentRepository.js";
import IUseCase from "../../interfaces/useCase.js";

export default class GetStudent implements IUseCase<Student> {
  constructor(protected studentRepo: IStudentRepository) {}

  async call(id: string): Promise<Student> {
    const student = await this.studentRepo.findByIdAsync(id);
    if (!student) {
      throw new Error("Student not found.");
    }

    return student;
  }
}
