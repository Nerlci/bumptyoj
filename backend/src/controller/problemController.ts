import { Request, Response } from 'express';
import { problemService } from '../service/problemService';
import { encryptPassword, validatePassword } from '../utils/utils';
import { problem, problemMetadata, responseBase } from '../schema';

const createProblem = async (req: Request, res: Response) => {
    const { metadata, ...rest } = req.body;
    const data = {
        metadata,
        ...rest,
    };

    const prob = problem.parse(data);

    const result = await problemService.createProblem(prob);

    const resProb = problemService.mapResponseToProblem(result);
    res.send(responseBase.parse({ 
        code: "200",
        payload: resProb,
        error: {
            msg: "",
        }
    }));
}

const modifyProblem = async (req: Request, res: Response) => {
    const { metadata, ...rest } = req.body;
    const data = {
        metadata,
        ...rest,
    };

    const prob = problem.parse(data);

    const result = await problemService.modifyProblem(Number(req.query.problemId), prob);

    const resProb = problemService.mapResponseToProblem(result);
    res.send(responseBase.parse({ 
        code: "200",
        payload: resProb,
        error: {
            msg: "",
        }
    }));
}

const getProblem = async (req: Request, res: Response) => {
    const problemId = Number(req.query.problemId);
    const result = await problemService.getProblem(problemId);

    const resProb = problemService.mapResponseToProblem(result);

    if (!resProb) {
        res.send(responseBase.parse({ 
            code: "400",
            payload: {},
            error: {
                msg: "Problem not found",
            }
        }));
        return;
    }

    res.send(responseBase.parse({ 
        code: "200",
        payload: resProb,
        error: {
            msg: "",
        }
    }));
}

const deleteProblem = async (req: Request, res: Response) => {
    const problemId = Number(req.query.problemId);
    const result = await problemService.deleteProblem(problemId);
    res.send(responseBase.parse({ 
        code: "200",
        payload: {},
        error: {
            msg: "",
        }
    }));
}

const countProblem = async (req: Request, res: Response) => {
    const result = await problemService.countProblem();
    res.send(responseBase.parse({ 
        code: "200",
        payload: {
            count: result,
        },
        error: {
            msg: "",
        }
    }));
}

const listProblem = async (req: Request, res: Response) => {
    const count = Number(req.query.count), offset = Number(req.query.offset);
    const result = await problemService.listProblem(count, offset);

    const resProb = result.map((result) => problemService.mapResponseToProblemMetadata(result));
    res.send(responseBase.parse({ 
        code: "200",
        payload: {
            count: resProb.length,
            problems: resProb,
        },
        error: {
            msg: "",
        }
    }));
}

const problemController = {
    createProblem,
    modifyProblem,
    getProblem,
    deleteProblem,
    countProblem,
    listProblem,
};

export { problemController };