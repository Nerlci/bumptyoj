import { Request, Response } from "express";
import { discussionService } from "../service/discussionService";
import { comment, discussionPost, responseBase } from "../schema";
import { handleErrors } from "../utils/utils";

const getPost = async (req: Request, res: Response) => {
  const postId = Number(req.query.postId);

  try {
    const result = await discussionService.getPost(postId);

    const resultData = discussionPost.parse({
      ...result,
      postId: result!.id,
      userId: result!.user.id,
      author: result!.user.username,
    });

    res.send(
      responseBase.parse({
        code: "200",
        payload: resultData,
        error: { msg: "" },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const createPost = async (req: Request, res: Response) => {
  const userId = Number(res.locals.user.userId);
  const username = String(res.locals.user.username);

  try {
    const data = discussionPost.parse({
      ...req.body,
      userId,
      author: username,
    });

    const result = await discussionService.createPost(data);

    res.send(
      responseBase.parse({
        code: "200",
        payload: discussionPost.parse({
          ...result,
          postId: result.id,
          author: username,
        }),
        error: { msg: "" },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const modifyPost = async (req: Request, res: Response) => {
  // TODO: check if the post is created by current user
  const userId = Number(res.locals.user.userId);
  const username = String(res.locals.user.username);
  const postId = Number(req.query.postId);

  try {
    const data = discussionPost.parse({
      ...req.body,
      userId,
      author: username,
    });

    const result = await discussionService.modifyPost(postId, data);

    res.send(
      responseBase.parse({
        code: "200",
        payload: discussionPost.parse({
          ...result,
          postId: result.id,
          author: username,
        }),
        error: { msg: "" },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const deletePost = async (req: Request, res: Response) => {
  // TODO: check if the post is created by current user
  const postId = Number(req.query.postId);

  try {
    const result = await discussionService.deletePost(postId);

    res.send(
      responseBase.parse({
        code: "200",
        payload: {},
        error: { msg: "" },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const listPost = async (req: Request, res: Response) => {
  const category = String(req.query.category) || undefined;
  const offset = Number(req.query.offset);
  const count = Number(req.query.count);

  try {
    const result = await discussionService.listPost(category, offset, count);

    const resultData = result.map((post) =>
      discussionPost.parse({
        ...post,
        postId: post.id,
        userId: post.user.id,
        author: post.user.username,
      }),
    );

    res.send(
      responseBase.parse({
        code: "200",
        payload: {
          posts: resultData.map((post) => {
            const { content, ...rest } = post;
            return rest;
          }),
          count: resultData.length,
        },
        error: { msg: "" },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const countPost = async (req: Request, res: Response) => {
  const result = await discussionService.countPost();

  res.send(
    responseBase.parse({
      code: "200",
      payload: { count: result },
      error: { msg: "" },
    }),
  );
};

const getComment = async (req: Request, res: Response) => {
  const postId = Number(req.query.postId);
  const offset = Number(req.query.offset);
  const count = Number(req.query.count);

  try {
    const result = await discussionService.getComment(postId, offset, count);

    const resultData = result.map((c) =>
      comment.parse({
        ...c,
        commentId: c.id,
        userId: c.user.id,
        author: c.user.username,
      }),
    );

    res.send(
      responseBase.parse({
        code: "200",
        payload: { postId, comments: resultData, count: resultData.length },
        error: { msg: "" },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const createComment = async (req: Request, res: Response) => {
  const userId = Number(res.locals.user.userId);
  const username = String(res.locals.user.username);
  try {
    const data = comment.parse({
      ...req.body,
      userId,
      author: username,
    });

    const result = await discussionService.createComment(data);

    res.send(
      responseBase.parse({
        code: "200",
        payload: comment.parse({
          ...result,
          commentId: result.id,
          author: username,
        }),
        error: { msg: "" },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const modifyComment = async (req: Request, res: Response) => {
  // TODO: check if the comment is created by current user
  const userId = Number(res.locals.user.userId);
  const username = String(res.locals.user.username);
  const commentId = Number(req.query.commentId);
  try {
    const data = comment.parse({
      ...req.body,
      userId,
      author: username,
    });

    const result = await discussionService.modifyComment(commentId, data);

    res.send(
      responseBase.parse({
        code: "200",
        payload: comment.parse({
          ...result,
          commentId: result.id,
          author: username,
        }),
        error: { msg: "" },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const deleteComment = async (req: Request, res: Response) => {
  // TODO: check if the comment is created by current user
  const commentId = Number(req.query.commentId);

  try {
    const result = await discussionService.deleteComment(commentId);

    res.send(
      responseBase.parse({
        code: "200",
        payload: {},
        error: { msg: "" },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const discussionController = {
  getPost,
  createPost,
  modifyPost,
  deletePost,
  listPost,
  countPost,
  getComment,
  createComment,
  modifyComment,
  deleteComment,
};

export { discussionController };
