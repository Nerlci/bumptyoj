import express from "express";
import { authUserMiddleware } from "../controller/userController";
import { classController } from "../controller/classController";

let classRouter = express.Router();

classRouter.post("/class", authUserMiddleware, classController.createClass);

classRouter.get("/class", authUserMiddleware, classController.getClass);

classRouter.put("/class", authUserMiddleware, classController.modifyClass);

classRouter.delete("/class", authUserMiddleware, classController.deleteClass);

export { classRouter };
