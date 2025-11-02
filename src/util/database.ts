import mongodb from "mongodb";
const MongoClient = mongodb.MongoClient;

let _db: mongodb.Db;

const mongoConnect = (callback: () => void): void => {
  MongoClient.connect("mongodb://localhost:27017/studentdb")
    .then((client) => {
      console.log("Database Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => console.log(err));
};

const getDb = (): mongodb.Db => {
  if (_db) {
    return _db;
  }

  throw new Error("No database found");
};

export { getDb, mongoConnect };
