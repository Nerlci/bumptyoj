import express from "express";
import { discussionController } from "../controller/discussionController";
import { authUserMiddleware } from "../controller/userController";

const discussionRouter = express.Router();

discussionRouter.get("/post", discussionController.getPost);

discussionRouter.post(
  "/post",
  authUserMiddleware,
  discussionController.createPost,
);

discussionRouter.put(
  "/post",
  authUserMiddleware,
  discussionController.modifyPost,
);

discussionRouter.delete(
  "/post",
  authUserMiddleware,
  discussionController.deletePost,
);

discussionRouter.get("/list", discussionController.listPost);

discussionRouter.get("/count", discussionController.countPost);

discussionRouter.get("/comment", discussionController.getComment);

discussionRouter.post(
  "/comment",
  authUserMiddleware,
  discussionController.createComment,
);

discussionRouter.put(
  "/comment",
  authUserMiddleware,
  discussionController.modifyComment,
);

discussionRouter.delete(
  "/comment",
  authUserMiddleware,
  discussionController.deleteComment,
);

discussionRouter.get("/comment/count", discussionController.countComment);

export { discussionRouter };
