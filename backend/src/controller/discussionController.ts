import { Request, Response } from "express";
import { discussionService } from "../service/discussionService";
import { comment, discussionPost, responseBase } from "../schema";

const getPost = async (req: Request, res: Response) => {
  const postId = Number(req.query.postId);

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
      error: { message: "" },
    }),
  );
};

const createPost = async (req: Request, res: Response) => {
  const userId = Number(res.locals.user.userId);
  const username = String(res.locals.user.username);

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
      error: { message: "" },
    }),
  );
};

const modifyPost = async (req: Request, res: Response) => {
  // TODO: check if the post is created by current user
  const userId = Number(res.locals.user.userId);
  const username = String(res.locals.user.username);
  const postId = Number(req.query.postId);

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
      error: { message: "" },
    }),
  );
};

const deletePost = async (req: Request, res: Response) => {
  // TODO: check if the post is created by current user
  const postId = Number(req.query.postId);

  const result = await discussionService.deletePost(postId);

  res.send(
    responseBase.parse({
      code: "200",
      payload: {},
      error: { message: "" },
    }),
  );
};

const listPost = async (req: Request, res: Response) => {
  const category = String(req.query.category) || undefined;
  const offset = Number(req.query.offset);
  const count = Number(req.query.count);

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
      error: { message: "" },
    }),
  );
};

const countPost = async (req: Request, res: Response) => {
  const result = await discussionService.countPost();

  res.send(
    responseBase.parse({
      code: "200",
      payload: { count: result },
      error: { message: "" },
    }),
  );
};

const getComment = async (req: Request, res: Response) => {
  const postId = Number(req.query.postId);
  const offset = Number(req.query.offset);
  const count = Number(req.query.count);

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
      error: { message: "" },
    }),
  );
};

const createComment = async (req: Request, res: Response) => {
  const userId = Number(res.locals.user.userId);
  const username = String(res.locals.user.username);
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
      error: { message: "" },
    }),
  );
};

const modifyComment = async (req: Request, res: Response) => {
  // TODO: check if the comment is created by current user
  const userId = Number(res.locals.user.userId);
  const username = String(res.locals.user.username);
  const commentId = Number(req.query.commentId);
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
      error: { message: "" },
    }),
  );
};

const deleteComment = async (req: Request, res: Response) => {
  // TODO: check if the comment is created by current user
  const commentId = Number(req.query.commentId);

  const result = await discussionService.deleteComment(commentId);

  res.send(
    responseBase.parse({
      code: "200",
      payload: {},
      error: { message: "" },
    }),
  );
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
