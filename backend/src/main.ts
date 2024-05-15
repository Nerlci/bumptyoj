import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiRouter } from "./router/apiRouter";

const app = express();

app.use(cors({ credentials: true, preflightContinue: true, origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("Hello, world!");
});

app.get("/echo", async (req, res) => {
  res.send(req.body);
});

app.use("/api", apiRouter);

const port = process.env.PORT || 8888;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
