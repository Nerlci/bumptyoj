import { Request, Response, NextFunction } from "express";
import { userService } from "../service/userService";
import { encryptPassword, validatePassword } from "../utils/utils";
import { responseBase } from "../schema";
import jwt from "jsonwebtoken";
import { get } from "node:http";

const registerUser = async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  const emailAvailable = await userService.checkEmailAvailability(email);

  if (!emailAvailable) {
    const response = responseBase.parse({
      error: {
        msg: "Email already taken",
      },
      code: "400",
      payload: {},
    });

    res.json(response);
    return;
  }

  const hashedPassword = await encryptPassword(password);

  const user = await userService.createUser({
    email,
    username,
    password: hashedPassword,
  });

  const response = responseBase.parse({
    error: {
      msg: "",
    },
    code: "200",
    payload: {
      userId: user.id,
      email: user.email,
      username: user.username,
      type: user.type,
    },
  });

  res.json(response);
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      username: string;
      type: string;
    };

    const response = responseBase.parse({
      code: "200",
      payload: {
        userId: decoded.userId,
        username: decoded.username,
        type: decoded.type,
      },
      error: {
        msg: "",
      },
    });

    res.json(response);
    return;
  } catch (err) {}

  const { email, password } = req.body;

  const user = await userService.getUserByEmail(email);

  if (!user) {
    const response = responseBase.parse({
      error: {
        msg: "Invalid email or password",
      },
      code: "400",
      payload: {},
    });

    res.json(response);
    return;
  }

  const isValid = await validatePassword(password, user.password);

  if (!isValid) {
    const response = responseBase.parse({
      error: {
        msg: "Invalid email or password",
      },
      code: "400",
      payload: {},
    });

    res.json(response);
    return;
  }

  const response = responseBase.parse({
    error: {
      msg: "",
    },
    code: "200",
    payload: {
      userId: user.id,
      username: user.username,
      type: user.type,
    },
  });

  const token = jwt.sign(
    { userId: user.id, username: user.username, type: user.type },
    process.env.JWT_SECRET!,
  );

  res.cookie("token", token);
  res.json(response);
};

const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("token");
  const response = responseBase.parse({
    error: {
      msg: "",
    },
    code: "200",
    payload: {
      message: "Logged out",
    },
  });

  res.json(response);
};

const getUser = async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);

  const user = await userService.getUserById(userId);

  const response = responseBase.parse({
    error: {
      msg: "",
    },
    code: "200",
    payload: {
      userId: user!.id,
      username: user!.username,
      type: user!.type,
    },
  });

  res.json(response);
};

const authUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    const response = responseBase.parse({
      error: {
        msg: "Not logged in, please login first",
      },
      code: "400",
      payload: {},
    });

    res.json(response);
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    res.locals.user = decoded;
  } catch (err) {
    const response = responseBase.parse({
      error: {
        msg: "Not logged in, please login first",
      },
      code: "400",
      payload: {},
    });

    res.json(response);
    return;
  }

  next();
};

const userController = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
};

export { userController, authUserMiddleware };
