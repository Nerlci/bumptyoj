import express from "express";
import { userRouter } from "./userRouter";
import { problemRouter } from "./problemRouter";

let apiRouter = express.Router();

apiRouter.post("/echo", async (req, res) => {
    res.send(req.body);
});

apiRouter.use("/user", userRouter);

apiRouter.use("/problem", problemRouter);

export { apiRouter };
