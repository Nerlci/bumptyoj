import { prisma } from "../prisma";
import { Class } from "../schema";

const createClass = async (data: Class) => {
  return prisma.class.create({
    data: {
      ...data,
    },
  });
};

const getClass = async (classId: number) => {
  return prisma.class.findUnique({
    where: {
      id: classId,
    },
  });
};

const modifyClass = async (classId: number, data: Class) => {
  return prisma.class.update({
    where: {
      id: classId,
    },
    data: {
      ...data,
    },
  });
};

const deleteClass = async (classId: number) => {
  return prisma.class.delete({
    where: {
      id: classId,
    },
  });
};

export const classService = {
  createClass,
  getClass,
  modifyClass,
  deleteClass,
};
