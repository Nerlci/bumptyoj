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

const sendErrorMsg = (res: Response, msg: string) => {
  res.send(
    responseBase.parse({
      code: "500",
      payload: {},
      error: {
        msg,
      },
    }),
  );
};

function handleErrors(error: unknown, res: Response<any, Record<string, any>>) {
  if (error instanceof z.ZodError) {
    sendErrorMsg(res, error.errors.map((e) => e.message).join("; "));
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const errorMessage = `Code: ${error.code}, Meta: ${JSON.stringify(error.meta)}`;
    sendErrorMsg(res, errorMessage);
  } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    sendErrorMsg(res, error.message);
  } else if (error instanceof Error) {
    console.log(error);
    sendErrorMsg(res, error.message);
  } else {
    console.log(error);
    sendErrorMsg(res, String(error));
  }
}

export { encryptPassword, validatePassword, handleErrors };
