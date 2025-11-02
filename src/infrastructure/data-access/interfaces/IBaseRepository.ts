import {
  Filter,
  OptionalUnlessRequiredId,
  UpdateFilter,
  WithId,
} from "mongodb";

export default interface IBaseRepository<T> {
  createAsync(document: OptionalUnlessRequiredId<T>): Promise<WithId<T>>;
  findOneAsync(filter: Filter<T>): Promise<WithId<T> | null>;
  findByIdAsync(id: string): Promise<WithId<T> | null>;
  findAsync(filter: Filter<T>): Promise<WithId<T>[]>;
  findAllAsync(): Promise<WithId<T>[]>;
  findAllPagingAsync(pageNo: number, pageSize: number): Promise<WithId<T>[]>;
  getTotalCountAsync(): Promise<number>;
  updateByIdAsync(id: string, data: T): void;
  patchAsync(filter: Filter<T>, update: UpdateFilter<T>): Promise<boolean>;
  deletesync(id: string): void;
}
