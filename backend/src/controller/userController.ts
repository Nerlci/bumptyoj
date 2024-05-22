import { Request, Response, NextFunction } from "express";
import { userService } from "../service/userService";
import {
  encryptPassword,
  handleErrors,
  validatePassword,
} from "../utils/utils";
import { BumptyError, responseBase, user } from "../schema";
import jwt from "jsonwebtoken";
import { get } from "node:http";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      throw new BumptyError("400", "Invalid input");
    }

    const emailAvailable = await userService.checkEmailAvailability(email);

    if (!emailAvailable) {
      throw new BumptyError("400", "Email already taken");
    }

    const hashedPassword = encryptPassword(password);

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
  } catch (err) {
    handleErrors(err, res);
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    try {
      const token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number;
        username: string;
        email: string;
        type: string;
      };

      const response = responseBase.parse({
        code: "200",
        payload: {
          userId: decoded.userId,
          username: decoded.username,
          email: decoded.email,
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
      throw new BumptyError("400", "Invalid email or password");
    }

    const isValid = validatePassword(password, user.password);

    if (!isValid) {
      throw new BumptyError("400", "Invalid email or password");
    }

    const response = responseBase.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {
        userId: user.id,
        username: user.username,
        email: user.email,
        type: user.type,
      },
    });

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        email: user.email,
        type: user.type,
      },
      process.env.JWT_SECRET!,
    );

    res.cookie("token", token);
    res.json(response);
  } catch (err) {
    handleErrors(err, res);
  }
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
  try {
    const userId = Number(req.query.userId);

    const user = await userService.getUserById(userId);

    if (!user) {
      throw new BumptyError("400", "User not found");
    }

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
  } catch (err) {
    handleErrors(err, res);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const userId = Number(req.query.userId);
    const curUserId = res.locals.user.userId;
    const userType = res.locals.user.type;

    const curUser = await userService.getUserById(curUserId);

    if (!curUser) {
      throw new BumptyError("400", "User not found");
    }

    if (!validatePassword(data.checkPassword, curUser.password)) {
      throw new BumptyError("400", "Invalid password");
    }

    if (userType !== 0 && curUserId !== userId) {
      throw new BumptyError("400", "Permission denied");
    }

    const tarUser = await userService.getUserById(userId);

    if (!tarUser) {
      throw new BumptyError("400", "User not found");
    }

    const updatedUser = await userService.updateUser(userId, {
      username: data.username,
      email: data.email,
      password: data.password
        ? encryptPassword(data.password)
        : tarUser.password,
      type: data.type,
    });

    const response = responseBase.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {
        userId: updatedUser.id,
        email: updatedUser.email,
        username: updatedUser.username,
        type: updatedUser.type,
      },
    });

    res.json(response);
  } catch (err) {
    handleErrors(err, res);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.query.userId);
    const userType = res.locals.user.type;

    if (userType !== 0) {
      throw new BumptyError("400", "Permission denied");
    }

    await userService.deleteUser(userId);

    const response = responseBase.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {},
    });

    res.json(response);
  } catch (err) {
    handleErrors(err, res);
  }
};

const listUser = async (req: Request, res: Response) => {
  try {
    const userType = res.locals.user.type;
    if (userType !== 0) {
      throw new BumptyError("400", "Permission denied");
    }

    const count = Number(req.query.count);
    const offset = Number(req.query.offset) | 0;
    const users = await userService.listUser(count, offset);

    const resUser = users.map((user) => {
      return {
        userId: user.id,
        email: user.email,
        username: user.username,
        type: user.type,
      };
    });

    const response = responseBase.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {
        users: resUser,
      },
    });

    res.json(response);
  } catch (err) {
    handleErrors(err, res);
  }
};

const countUser = async (req: Request, res: Response) => {
  try {
    const userType = res.locals.user.type;
    if (userType !== 0) {
      throw new BumptyError("400", "Permission denied");
    }

    const count = await userService.countUser();

    const response = responseBase.parse({
      error: {
        msg: "",
      },
      code: "200",
      payload: {
        count,
      },
    });

    res.json(response);
  } catch (err) {
    handleErrors(err, res);
  }
};

const authUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      throw new BumptyError("400", "Not logged in, please login first");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      res.locals.user = decoded;
    } catch (err) {
      throw new BumptyError("400", "Not logged in, please login first");
    }
    next();
  } catch (err) {
    handleErrors(err, res);
  }
};

const userController = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser,
  deleteUser,
  listUser,
  countUser,
};

export { userController, authUserMiddleware };
