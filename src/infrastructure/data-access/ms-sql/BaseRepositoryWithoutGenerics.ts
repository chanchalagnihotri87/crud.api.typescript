// const { getDB } = require('./db');
// const { ObjectId } = require('mongodb'); // For handling MongoDB's _id

import { Collection, Document, ObjectId } from "mongodb";
import { getDb } from "../../../util/database.js";

class BaseRepositoryWithoutGenerics {
  private collection: Collection<Document>;

  constructor(collectionName: string) {
    this.collection = getDb().collection(collectionName);
  }

  public async create(data: Document) {
    const result = await this.collection.insertOne(data);
    return result.insertedId;
  }

  public async findById(id: string) {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  public async findAll() {
    return await this.collection.find({}).toArray();
  }

  public async findMany(query: {}) {
    return await this.collection.find(query).toArray();
  }

  public async update(id: string, data: Document) {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
    return result.modifiedCount;
  }

  public async delete(id: string) {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount;
  }
}

export default BaseRepository;
