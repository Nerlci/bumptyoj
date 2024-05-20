import { prisma } from "../prisma";

const createUser = async (data: {
  email: string;
  password: string;
  username: string;
}) => {
  return prisma.user.create({
    data,
  });
};

const getUserByEmail = (email: string) => {
  return prisma.user.findFirst({
    where: {
      email,
    },
  });
};

const getUserById = (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
};

const checkEmailAvailability = async (email: string) => {
  const user = await getUserByEmail(email);

  return !user;
};

const updateUser = async (
  id: number,
  data: {
    username: string;
    email: string;
    password: string | undefined;
    type: number;
  },
) => {
  return prisma.user.update({
    where: {
      id,
    },
    data,
  });
};

const deleteUser = async (id: number) => {
  return prisma.user.delete({
    where: {
      id,
    },
  });
};

const listUser = async (count: number, offset: number) => {
  return prisma.user.findMany({
    take: count,
    skip: offset,
    select: { id: true, email: true, username: true, type: true },
  });
};

const countUser = async () => {
  return prisma.user.count();
};

const userService = {
  createUser,
  getUserByEmail,
  getUserById,
  checkEmailAvailability,
  updateUser,
  deleteUser,
  listUser,
  countUser,
};

export { userService };
