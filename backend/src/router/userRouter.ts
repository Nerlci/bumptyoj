import express from "express";
import {
  userController,
  authUserMiddleware,
} from "../controller/userController";

let userRouter = express.Router();

userRouter.post("/register", userController.registerUser);

userRouter.post("/login", userController.loginUser);

userRouter.get("/logout", userController.logoutUser);

userRouter.get("/user", userController.getUser);

userRouter.put("/user", authUserMiddleware, userController.updateUser);

userRouter.delete("/user", authUserMiddleware, userController.deleteUser);

userRouter.get("/list", authUserMiddleware, userController.listUser);

userRouter.get("/count", authUserMiddleware, userController.countUser);

export { userRouter };
