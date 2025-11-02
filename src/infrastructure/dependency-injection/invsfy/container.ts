import { Container } from "inversify";
import StudentRepository from "../../infrastructure/data-access/ms-sql/MSSQLStudentRepository.js";

const container: Container = new Container();

container.bind(StudentRepository).toSelf();

export default container;
