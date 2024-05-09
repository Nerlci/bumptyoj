import { Request, Response } from "express";
import { Class, class_, responseBase } from "../schema";
import { classService } from "../service/classService";

const createClass = async (req: Request, res: Response) => {
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
};

const getClass = async (req: Request, res: Response) => {
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
};

const modifyClass = async (req: Request, res: Response) => {
  const { ...data } = req.body;
  data.teacherId = Number(data.teacherId);
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
};

const deleteClass = async (req: Request, res: Response) => {
  const classId = Number(req.query.classId);
  const result = await classService.deleteClass(classId);

  res.send(
    responseBase.parse({
      code: "200",
      payload: result,
      error: {
        msg: "",
      },
    }),
  );
};

const listClass = async (req: Request, res: Response) => {
  const userId = res.locals.user.userId;

  const result = await classService.listClass(userId);

  res.send(
    responseBase.parse({
      code: "200",
      payload: { classes: result },
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
};
