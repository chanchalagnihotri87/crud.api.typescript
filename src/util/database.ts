import mongodb from "mongodb";
const MongoClient = mongodb.MongoClient;

let _db: mongodb.Db;

const mongoConnect = (callback: () => void): void => {
  const monogUri =
    process.env.MONGO_URI ||
    "mongodb+srv://chanchal:chanchal@cluster0.50iio.mongodb.net/?appName=Cluster0" ||
    "mongodb://localhost:27017/studentdb";
  // process.env.MONGO_URI || "mongodb://localhost:27017/studentdb";
  MongoClient.connect(monogUri)
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
