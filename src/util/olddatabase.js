import mongodb from "mongodb";
const MongoClient = mongodb.MongoClient;
let _db: mongodb.Db;

const mongoConnect = (callback: any) => {
  MongoClient.connect("mongodb://localhost:27017/studentdb")
    .then((client) => {
      console.log("Database Connectect!");
      _db = client.db();
      callback();
    })
    .catch((err) => console.log(err));
};

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw "No database found";
};

exports.mongoConnect = mongoConnect;

exports.getDb = getDb;
