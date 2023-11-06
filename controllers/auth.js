import { ObjectId } from "mongodb";
import { findOne } from "../database/mongoDB.js";
import { decode } from "./utils.js";

async function verify(token) {}

export default async function auth(req, res, next) {
  try {
    const authToken =
      req.headers?.["authorization"]?.split?.(" ")?.at?.(-1) || null;

    if (!authToken) {
      throw new Error("⚠️ Auth Token is Required!");
    }

    const { userId } = decode(authToken);
    const existingUser = await findOne("users", { _id: new ObjectId(userId) });
    if (!existingUser) {
      throw new Error("⚠️ User doesn't exists!");
    }

    req.token = authToken;
    req.userId = userId;
    next();
  } catch (err) {
    next(err);
  }
}
