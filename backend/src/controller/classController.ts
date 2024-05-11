import { Request, Response } from "express";
import { Class, class_, responseBase } from "../schema";
import { classService } from "../service/classService";
import { handleErrors } from "../utils/utils";

const createClass = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    const classBody = class_.parse(data);

    const result = await classService.createClass(classBody);

    res.send(
      responseBase.parse({
        code: "200",
        payload: result,
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const getClass = async (req: Request, res: Response) => {
  try {
    const classId = Number(req.query.classId);
    const result = await classService.getClass(classId);

    res.send(
      responseBase.parse({
        code: "200",
        payload: result,
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const modifyClass = async (req: Request, res: Response) => {
  try {
    const { ...data } = req.body;
    data.teacherId = Number(data.teacherId);
    data.classId = Number(req.query.classId);
    const classBody = class_.parse(data);
    const result = await classService.modifyClass(classBody.classId, classBody);

    res.send(
      responseBase.parse({
        code: "200",
        payload: result,
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const deleteClass = async (req: Request, res: Response) => {
  try {
    const classId = Number(req.query.classId);
    const result = await classService.deleteClass(classId);

    res.send(
      responseBase.parse({
        code: "200",
        payload: {},
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const listClass = async (req: Request, res: Response) => {
  try {
    const count = Number(req.query.count);
    const offset = Number(req.query.offset);
    const userId = res.locals.user.userId;
    const result = await classService.listClass(userId, count, offset);

    res.send(
      responseBase.parse({
        code: "200",
        payload: { classes: result },
        error: {
          msg: "",
        },
      }),
    );
  } catch (error) {
    handleErrors(error, res);
  }
};

const countClass = async (req: Request, res: Response) => {
  const result = await classService.countClass();

  res.send(
    responseBase.parse({
      code: "200",
      payload: { count: result },
      error: {
        msg: "",
      },
    }),
  );
};

export const classController = {
  createClass,
  getClass,
  modifyClass,
  deleteClass,
  listClass,
  countClass,
};
