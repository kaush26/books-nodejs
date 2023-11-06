import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";
import { unix } from "../controllers/utils.js";

const DB = process.env.DB_NAME;
const URI = process.env.DB_URI;

let db = null;

export function connect(cb) {
  try {
    const client = new MongoClient(URI);
    db = client.db(DB);

    return cb(db);
  } catch (err) {
    return cb(null);
  }
}

function parseId(_id) {
  try {
    return new ObjectId(_id);
  } catch (err) {
    throw new Error("⚠️ Incorrect ID!, ID must be a 24 character hex string");
  }
}

function getCollection(collection) {
  if (!db) throw new Error("No Connection to the database");
  return db.collection(collection);
}

export async function findOne(collection, filter = {}, options = {}) {
  try {
    const coll = getCollection(collection);

    return await coll.findOne(filter, options);
  } catch (err) {
    throw err;
  }
}

export async function find(
  collection,
  filter = {},
  options = {},
  cursor = true
) {
  try {
    const coll = getCollection(collection);
    const cursor_ = await coll.find(filter, options);
    if (cursor) return cursor_;

    return await cursor_.toArray();
  } catch (err) {
    throw err;
  }
}

export async function insert(collection, doc) {
  try {
    const coll = getCollection(collection);
    return await coll.insertOne({
      ...doc,
      createdAt: unix(),
      updatedAt: unix(),
    });
  } catch (err) {
    throw err;
  }
}

export async function insertOnly(collection, filter, doc) {
  try {
    const coll = getCollection(collection);
    const existingData = await findOne(collection, filter);
    if (existingData) {
      return { existing: true };
    }
    return await coll.insertOne({
      ...doc,
      createdAt: unix(),
      updatedAt: unix(),
    });
  } catch (err) {
    throw err;
  }
}

export async function update(collection, filter, data = {}) {
  try {
    const coll = getCollection(collection);
    if (filter && "_id" in filter) filter._id = parseId(filter._id);

    return await coll.updateOne(filter, {
      $set: { ...data, updatedAt: unix() },
    });
  } catch (err) {
    throw err;
  }
}

export async function deleteByIds(collection, _ids) {
  try {
    const coll = getCollection(collection);
    _ids = [].concat(_ids).map((_id) => parseId(_id));

    return await coll.deleteMany({ _id: { $in: _ids } });
  } catch (err) {
    throw err;
  }
}

export async function deleteMany(collection, filter) {
  try {
    const coll = getCollection(collection);

    const re = await coll.deleteMany(filter);
    console.log(re, filter);
    return re;
  } catch (err) {
    throw err;
  }
}
