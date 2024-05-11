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

const mapClassToResponseNoStu = (result: any) => {
  if (!result) return null;
  return result.map((item: any) => {
    return {
      classId: item.id,
      className: item.name,
      teacherId: item.teacherId,
    };
  });
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
const listClass = async (userId: number, count: number, offset: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      type: true,
    },
  });
  if (!user) return null;

  let result;
  // 2: teacher, 1: student
  if (user.type === 2) {
    result = await prisma.class.findMany({
      where: {
        teacherId: userId,
      },
      include: {
        students: {
          select: {
            id: true,
          },
        },
      },
      take: count,
      skip: offset,
    });
  } else if (user.type === 1) {
    result = await prisma.class.findMany({
      where: {
        students: {
          some: {
            id: userId,
          },
        },
      },
      take: count,
      skip: offset,
    });
  }

  return mapClassToResponseNoStu(result);
};

const countClass = async () => {
  return prisma.class.count();
};

export const classService = {
  createClass,
  getClass,
  modifyClass,
  deleteClass,
  listClass,
  countClass,
};
