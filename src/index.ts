import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import admin from "firebase-admin";
import firebaseAccountCredentials from "../assets/serviceAccountCredentials.json";

import router from "./router";
import mongoose from "mongoose";
import { MONGO_URL } from "./setting";
import { CommonException } from "./exc/base";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));

const serviceAccount = firebaseAccountCredentials as admin.ServiceAccount;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://april-course-management.appspot.com",
});

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = http.createServer(app);

server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Hello, TypeScript Express!");
});

app.use("/", router());
// @ts-expect-error
app.use((err, req, res, next) => {
  if (err instanceof CommonException)
    return res.status(err.status).json({ error: err.message });
  console.error(err.stack);
  return res.status(400).json({ status: false, error: err.message });
});
