import { prisma } from "../prisma";
import { Class } from "../schema";

const mapClassToResponse = (result: any) => {
  return {
    classId: result.id,
    teacherId: result.teacherId,
    className: result.name,
    students: result.students.map((student: any) => student.id),
  };
};

const createClass = async (data: Class) => {
  const result = await prisma.class.create({
    data: {
      name: data.className,
      teacherId: data.teacherId,
      students: {
        connect: data.students.map((studentId) => ({ id: studentId })),
      },
    },
    include: {
      students: {
        select: {
          id: true,
        },
      },
    },
  });

  return result ? mapClassToResponse(result) : null;
};

const getClass = async (classId: number) => {
  const result = await prisma.class.findUnique({
    where: {
      id: classId,
    },
    include: {
      students: {
        select: {
          id: true,
        },
      },
    },
  });

  return result ? mapClassToResponse(result) : null;
};

const modifyClass = async (classId: number, data: Class) => {
  const result = await prisma.class.update({
    where: {
      id: classId,
    },
    data: {
      name: data.className,
      teacherId: data.teacherId,
      students: {
        set: data.students.map((studentId) => ({ id: studentId })),
      },
    },
    include: {
      students: {
        select: {
          id: true,
        },
      },
    },
  });

  return result ? mapClassToResponse(result) : null;
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
