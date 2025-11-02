import { asClass, createContainer, InjectionMode } from "awilix";
import IStudentRepository from "../../data-access/interfaces/IStudentRepository.js";
import MSSQLStudentRepository from "../../data-access/ms-sql/MSSQLStudentRepository.js";

export interface Cardle {
  StudentRepository: IStudentRepository;
}

const container = createContainer<Cardle>({
  injectionMode: InjectionMode.CLASSIC,
});

container.register({
  StudentRepository: asClass(MSSQLStudentRepository).scoped(),
});

export default container;
