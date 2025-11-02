import { ObjectId } from "mongodb";

class Student {
  public _id?: ObjectId;

  constructor(
    public name: string,
    public rollNo: number,
    public clas: number,
    public photo: string
  ) {}

  //Just for support old code
  // async save(): Promise<string> {
  //   const db = getDb();
  //   const studentId = await db.collection("students").insertOne(this);

  //   return studentId.insertedId.toString();
  // }
}

export default Student;
