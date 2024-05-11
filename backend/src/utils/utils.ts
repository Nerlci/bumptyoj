import crypto from "crypto";
import { Response } from "express";
import { Prisma } from "@prisma/client";
import { responseBase } from "../schema";
import { z } from "zod";

const encryptPassword = async (password: string): Promise<string> => {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return [salt, hash].join("$");
};

const validatePassword = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const [salt, originalHash] = hashedPassword.split("$");

  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");

  return hash === originalHash;
};

const sendError = (res: Response, msg: Object) => {
  res.send(
    responseBase.parse({
      code: "500",
      payload: {},
      error: {
        ...msg,
      },
    }),
  );
};

function handleErrors(error: unknown, res: Response<any, Record<string, any>>) {
  if (error instanceof z.ZodError) {
    console.log(error);
    sendError(res, { msg: error.errors.map((e) => e.message).join("; ") });
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    console.log(error.code, error.meta, error.message);
    const err = {
      code: error.code,
      meta: error.meta,
      msg: error.message,
    };
    sendError(res, err);
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    console.log(error);
    sendError(res, { msg: error.message });
  } else if (error instanceof Error) {
    console.log(error);
    sendError(res, { msg: error.message });
  } else {
    console.log(error);
    sendError(res, { msg: String(error) });
  }
}

export { encryptPassword, validatePassword, handleErrors };
