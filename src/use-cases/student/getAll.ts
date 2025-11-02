import Student from "../../entities/student.js";
import IStudentRepository from "../../infrastructure/data-access/interfaces/IStudentRepository.js";
import PagingListResponse from "../../interfaces/pagingListResponse.js";
import IUseCase from "../../interfaces/useCase.js";

export default class GetAllStudents
  implements IUseCase<PagingListResponse<Student>>
{
  constructor(protected studentRepo: IStudentRepository) {}

  async call(payload: {
    pageNo: number;
    pageSize: number;
  }): Promise<PagingListResponse<Student>> {
    const students = await this.studentRepo.findAllPagingAsync(
      payload.pageNo,
      payload.pageSize
    );
    const totalStudents = await this.studentRepo.getTotalCountAsync();
    const totalPages = Math.ceil(totalStudents / payload.pageSize);

    return { records: students, totalPages: totalPages };
  }
}
