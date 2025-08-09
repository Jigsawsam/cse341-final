const { MongoClient } = require('mongodb');
require('dotenv').config();

let database;

const initDB = async (callback) => {
  if (database) return callback(null, database);

  try {
    const client = await MongoClient.connect(process.env.MONGODB_URL);
    database = client.db('mediaLibrary');
    console.log('Connected to DB');
    callback(null, database);
  } catch (err) {
    callback(err);
  }
};

const getDatabase = () => {
  if (!database) throw new Error('Database not initialized');
  return database;
};

module.exports = { initDB, getDatabase };
