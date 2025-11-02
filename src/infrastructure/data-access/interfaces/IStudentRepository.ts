import Student from "../../../entities/student.js";
import IBaseRepository from "./IBaseRepository.js";

export default interface IStudentRepository extends IBaseRepository<Student> {}
