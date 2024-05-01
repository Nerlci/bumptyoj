import express from "express";
import { authUserMiddleware } from "../controller/userController";
import { problemController } from "../controller/problemController";

let problemRouter = express.Router();

problemRouter.get("/problem", problemController.getProblem);

problemRouter.post("/problem", authUserMiddleware, problemController.createProblem);

problemRouter.put("/problem", authUserMiddleware, problemController.modifyProblem);

problemRouter.delete("/problem", authUserMiddleware, problemController.deleteProblem);

problemRouter.get("/list", problemController.listProblem);

problemRouter.get("/count", problemController.countProblem);

export { problemRouter };