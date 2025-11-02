import Student from "../../../entities/student.js";
import IStudentRepository from "../interfaces/IStudentRepository.js";
import MSSQLBaseRepository from "./MSSQLBaseRepository.js";

class MSSQLStudentRepository
  extends MSSQLBaseRepository<Student>
  implements IStudentRepository
{
  constructor() {
    super("students");
  }
}

export default MSSQLStudentRepository;
