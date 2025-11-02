import Student from "../../entities/student.js";
import IStudentRepository from "../../infrastructure/data-access/interfaces/IStudentRepository.js";
import IUseCase from "../../interfaces/useCase.js";

export default class UpdateStudent implements IUseCase<Student> {
  constructor(protected studentRepo: IStudentRepository) {}
  async call(payload: Partial<Student>): Promise<Student> {
    const { _id: studentId, name, rollNo, clas, photo } = payload;

    const student = await this.studentRepo?.findByIdAsync(
      studentId!.toHexString()
    );
    console.log("Student");
    console.log(student);

    if (!student) {
      throw new Error("Student not found");
    }

    student.name = name!;
    student.rollNo = rollNo!;
    student.clas = clas!;

    if (photo) {
      student.photo = photo;
    }

    await this.studentRepo?.updateByIdAsync(studentId!.toHexString(), student);

    return student;
  }
}
