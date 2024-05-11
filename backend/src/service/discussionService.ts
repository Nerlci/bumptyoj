import { prisma } from "../prisma";
import { Comment, DiscussionPost } from "../schema";

const getPost = async (postId: number) => {
  return prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

const createPost = async (data: DiscussionPost) => {
  const { postId, author, ...rest } = data;

  return prisma.post.create({
    data: {
      ...rest,
    },
  });
};

const modifyPost = async (postId: number, data: DiscussionPost) => {
  const { postId: id, author, ...rest } = data;

  return prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      ...rest,
    },
  });
};

const deletePost = async (postId: number) => {
  return prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

const listPost = async (
  category: string | undefined,
  offset: number,
  count: number,
) => {
  return prisma.post.findMany({
    where: {
      category: category,
    },
    skip: offset,
    take: count,
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

const countPost = async () => {
  return prisma.post.count();
};

const getComment = async (postId: number, offset: number, count: number) => {
  return prisma.comment.findMany({
    where: {
      postId: postId,
    },
    skip: offset,
    take: count,
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
  });
};

const createComment = async (data: Comment) => {
  const { commentId, author, ...rest } = data;

  return prisma.comment.create({
    data: {
      ...rest,
    },
  });
};

const modifyComment = async (commentId: number, data: Comment) => {
  const { commentId: id, postId, author, ...rest } = data;

  return prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      ...rest,
    },
  });
};

const deleteComment = async (commentId: number) => {
  return prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
};

const countComment = async (postId: number) => {
  return prisma.comment.count({
    where: {
      postId: postId,
    },
  });
};

const discussionService = {
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
  countComment,
};

export { discussionService };
