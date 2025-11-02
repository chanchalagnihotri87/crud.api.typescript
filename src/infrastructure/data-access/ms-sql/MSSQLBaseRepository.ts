// const { getDB } = require('./db');
// const { ObjectId } = require('mongodb'); // For handling MongoDB's _id

import {
  Collection,
  Document,
  Filter,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateFilter,
  WithId,
} from "mongodb";
import { getDb } from "../../../util/database.js";
import IBaseRepository from "../interfaces/IBaseRepository.js";

abstract class MSSQLBaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  protected collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

  protected get collection(): Collection<T> {
    return getDb().collection<T>(this.collectionName);
  }

  public async createAsync(
    document: OptionalUnlessRequiredId<T>
  ): Promise<WithId<T>> {
    const result = await this.collection.insertOne(document);
    const createdDocument = {
      _id: result.insertedId,
      ...document,
    } as WithId<T>;
    return createdDocument;
  }

  public async findOneAsync(filter: Filter<T>): Promise<WithId<T> | null> {
    return this.collection.findOne(filter);
  }

  public async findByIdAsync(id: string): Promise<WithId<T> | null> {
    return this.collection.findOne({ _id: new ObjectId(id) } as Filter<T>);
  }

  public async findAsync(filter: Filter<T> = {}): Promise<WithId<T>[]> {
    return this.collection.find(filter).toArray() as Promise<WithId<T>[]>;
  }

  public async findAllAsync() {
    return await this.collection.find({}).toArray();
  }

  public async findAllPagingAsync(pageNo: number, pageSize: number) {
    const skip = (pageNo - 1) * pageSize;

    return await this.collection.find({}).skip(skip).limit(pageSize).toArray();
  }

  public async getTotalCountAsync() {
    return await this.collection.countDocuments();
  }

  public async updateByIdAsync(id: string, data: T) {
    await this.collection.updateOne(
      { _id: ObjectId.createFromHexString(id) as any },
      { $set: data }
    );
  }

  public async patchAsync(
    filter: Filter<T>,
    update: UpdateFilter<T>
  ): Promise<boolean> {
    const result = await this.collection.updateOne(filter, update);
    return result.modifiedCount === 1;
  }

  public async deletesync(id: string) {
    return await this.collection.deleteOne({
      _id: ObjectId.createFromHexString(id) as any,
    });
  }

  // private async deleteAsync(filter: Filter<T>): Promise<boolean> {
  //   const result = await this.collection.deleteOne(filter);
  //   return result.deletedCount === 1;
  // }
}
export default MSSQLBaseRepository;
