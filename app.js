import "dotenv/config";
import path from "path";
import fs from "fs";
import morgan from "morgan";
import express from "express";
import bodyParser from "body-parser";
import { connect } from "./database/mongoDB.js";
import * as api from "./controllers/api.js";
import auth from "./controllers/auth.js";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type");

  next();
});

const accessLogStream = fs.createWriteStream(path.join(".", "access.log"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.json({ limit: "75mb" }));

app.get("/book", api.getAllBooks);
app.post("/book/:_id", api.getBook);
app.post("/add", auth, api.addBook);
app.post("/update/:_id", auth, api.updateBook);
app.post("/delete", auth, api.deleteBook);
app.post("/register", api.loginUser);

app.use((error, req, res, next) => {
  const code = error.code || 500;
  res.status(code).json({
    statusCode: error.code || 500,
    error: { message: error.message },
  });
});

const PORT = process.env.NODE_PORT || 4026;
connect((db) => {
  console.log("Connecting to Database...");
  if (!db) {
    console.log("Connecting to Database Failed!");
    return;
  }
  app.listen(PORT, () => {
    console.log(
      `🚀 Server is running on http://localhost:${PORT} \n❌ Press Ctrl + C to Stop the server.`
    );
  });
});

app.use(bodyParser.json({ limit: "75mb" }));
