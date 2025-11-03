import { Container } from "inversify";
import MSSQLStudentRepository from "../../data-access/ms-sql/MSSQLStudentRepository.js";

const container: Container = new Container();

container.bind(MSSQLStudentRepository).toSelf();

export default container;
