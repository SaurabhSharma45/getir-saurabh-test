const {  MongoClient } = require("mongodb");
const { promisify } = require("util");
const connectionString = process.env.GETIR_DB_CONNECTION_STRING;
const dbName = process.env.GETIR_DB_NAME;
const retryAttempts = process.env.GETIR_DB_RECONNECTION_TRIES;

let db;
let client;
async function connectToDatabase() {
  try {
    client = await MongoClient.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = client.db(dbName);
    return db;
  } catch (e) {
    console.log(`Could not connect to database at ${connectionString}`, e);
    throw e;
  }
}

function getCollection(collectionName) {
    return db.collection(collectionName);
}

function disconnectToDatabase(){
 console.log('Disconnecting database');
 client.close();
}


module.exports =  { connectToDatabase, getCollection, disconnectToDatabase };
