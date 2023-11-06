import bcrypt from "bcryptjs";
import * as db from "../database/mongoDB.js";
import { encode, parseValue } from "./utils.js";
import bookSchema from "../schema/books.js";
import userSchema from "../schema/users.js";
import { ObjectId } from "mongodb";

export const addBook = async (req, res, next) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const doc = parseValue(bookSchema, req.body);

    const result = await db.insertOnly(
      "books",
      { title: doc.title },
      { ...doc, userId }
    );

    if (result?.existing) {
      throw new Error("⚠️ A Book with this Title Already Exists.");
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getAllBooks = async (req, res) => {
  const data = await db.find("books", {}, {}, false);
  res.json(data);
};

export const getBook = async (req, res) => {
  const { _id } = req.params;

  if (!_id) {
    throw new Error("_id is required.");
  }

  const data = await db.findOne("books", { _id: new ObjectId(_id) });
  res.json(data);
};

export const updateBook = async (req, res, next) => {
  try {
    const { _id = null } = req.params;
    const userId = req.userId;
    const doc = req.body;

    for (const key in doc) {
      if (key in bookSchema) {
        continue;
      }
      delete doc[key];
      delete doc[key];
    }
    const result = await db.update("books", { _id, userId }, doc);

    if (!result || !result.matchedCount) {
      const error = new Error(`⚠️ ID doesn't exists for a given user!`);
      error.code = 403;
      throw error;
    }

    res.json({
      statusCode: 200,
      message: `👍ID ${_id} updated successfully!`,
      result,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBook = async (req, res, next) => {
  try {
    const doc = req.body;
    const userId = req.userId;
    const _ids = [].concat(doc._id).map((_id) => new ObjectId(_id));
    const result = await db.deleteMany("books", { _id: { $in: _ids }, userId });

    if (!result || !result.deletedCount) {
      const error = new Error(`⚠️ ID doesn't exists for a given user!`);
      error.code = 403;
      throw error;
    }

    res.json({
      statusCode: 200,
      message: `👍ID ${_ids.join(", ")} deleted successfully!`,
      result,
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const data = parseValue(userSchema, req.body);
    const { username, password } = data;

    const userData = await db.findOne("users", { username });

    if (!userData) {
      // register
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      const result = await db.insert("users", {
        username,
        password: hashedPassword,
      });

      if (!result) {
        const error = new Error(
          "Something went wrong while registering the user"
        );
        error.code = 500;
        throw error;
      }

      const userId = result.insertedId.toString();
      const token = encode({ username, userId });

      res.json({
        statusCode: 200,
        message: `✅ ${username} was Added Successfully!`,
        result: { token },
      });
    }

    const userId = userData._id.toString();
    // Authorization
    const isAuth = bcrypt.compareSync(password, userData.password);
    if (!isAuth) {
      const error = new Error(`⚠️ Incorrect Password!`);
      error.code = 403;
      throw error;
    }

    const token = encode({ username, userId });
    res.json({
      statusCode: 200,
      message: `✅ Token for ${username} was Generated Successfully!`,
      result: { token },
    });
  } catch (err) {
    next(err);
  }
};
