import Student from "../entities/student.js";
import BooleanResponse from "../interfaces/booleanResponse.js";
import PagingListResponse from "../interfaces/pagingListResponse.js";
import IRequest from "../interfaces/request.js";
import IUseCase from "../interfaces/useCase.js";

export default class StudentController {
  constructor(
    protected createStudent: IUseCase<Student>,
    protected updateStudent: IUseCase<Student>,
    protected deleteStudent: IUseCase<Boolean>,
    protected getAllStudents: IUseCase<PagingListResponse<Student>>,
    protected getStudent: IUseCase<Student>
  ) {}

  async create(request: IRequest): Promise<{ success: boolean }> {
    const payload = request.body;

    //Made some changes.

    const student = await this.createStudent.call(payload);

    return { success: !student._id };
  }

  async update(request: IRequest): Promise<BooleanResponse> {
    const payload = request.body;

    const student = await this.updateStudent.call(payload);

    return { success: !student._id };
  }

  async delete(studentId: string): Promise<BooleanResponse> {
    var studentDeleted = await this.deleteStudent.call(studentId);

    return { success: studentDeleted.valueOf() };
  }

  async getAll(pageNo: number, pageSize: number) {
    return await this.getAllStudents.call({ pageNo, pageSize });
  }

  async get(id: string) {
    return await this.getStudent.call(id);
  }
}
