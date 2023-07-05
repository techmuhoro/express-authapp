import type { NextFunction, Request, Response } from 'express';
import { resPayload } from '../../../utils/response.util';

interface ErrorObj {
    for: string;
    message: string;
    value?: any;
}
export async function validateViewPayload(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let { id } = req.params;

    if (isNaN(Number(id))) {
        return res
            .status(400)
            .json(resPayload(false, null, 'Id should be a number'));
    }

    return next();
}

export async function validateCreatePayload(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { name, description } = req.body;

    const errors: ErrorObj[] = [];
    if (!name) {
        errors.push({
            for: `Name`,
            message: `Name is required`,
            value: name,
        });
    }
    if (!description) {
        errors.push({
            for: 'description',
            message: 'description is required',
            value: description,
        });
    }

    if (errors.length > 0) {
        return res.status(400).json(resPayload(false, null, errors));
    }

    return next();
}

export async function validatePatch(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { id } = req.params;

    if (isNaN(Number(id))) {
        return res
            .status(400)
            .json(resPayload(false, null, 'Param id should be a number'));
    }

    return next();
}
