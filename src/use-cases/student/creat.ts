import Student from "../../entities/student.js";
import IStudentRepository from "../../infrastructure/data-access/interfaces/IStudentRepository.js";
import IUseCase from "../../interfaces/useCase.js";

export default class CreateUser implements IUseCase<Student> {
  constructor(protected studentRepo: IStudentRepository) {}
  async call(payload: Partial<Student>): Promise<Student> {
    const student = new Student(
      payload.name!,
      payload.rollNo!,
      payload.clas!,
      payload.photo!
    );

    return this.studentRepo.createAsync(student);
  }
}
