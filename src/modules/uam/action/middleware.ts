import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../utils/prisma.util';
import { resPayload } from '../../../utils/response.util';

interface ErrorObj {
    for: string;
    message: string;
    value?: any;
}

export async function validatePost(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { name, description, actionCategoryId } = req.body;
    const errors: ErrorObj[] = [];

    if (!name) {
        errors.push({
            for: 'name',
            message: 'Name is required',
            value: name,
        });
    }
    if (!description) {
        errors.push({
            for: 'description',
            message: 'description is required',
            value: name,
        });
    }

    // validate the provided action category id
    if (!actionCategoryId) {
        errors.push({
            for: 'actionCategoryId',
            message: 'actionCategoryId is required',
            value: name,
        });
    } else {
        if (isNaN(Number(actionCategoryId))) {
            errors.push({
                for: 'actionCategoryId',
                message: 'actionCategoryId should be a number',
                value: name,
            });
        } else {
            const data = await prisma.actionCategory.findUnique({
                where: {
                    id: Number(actionCategoryId),
                },
            });

            if (!data) {
                errors.push({
                    for: 'actionCategoryId',
                    message: 'actionCategoryId provided does not exist',
                    value: name,
                });
            }
        }
    }

    if (errors.length > 0) {
        return res.status(400).json(resPayload(false, null, errors));
    }

    return next();
}

export async function validateViewParams(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { id: actionId } = req.params;

    if (isNaN(Number(actionId))) {
        return res
            .status(400)
            .json(resPayload(false, null, `Provide a valid action id`));
    }

    return next();
}

export async function requireIdParam(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { id: actionId } = req.params;

    if (isNaN(Number(actionId))) {
        return res
            .status(400)
            .json(
                resPayload(
                    false,
                    null,
                    `Provide a valid action id param (number)`
                )
            );
    } else {
        const action = await prisma.action.findUnique({
            where: { id: Number(actionId) },
        });

        if (!action) {
            return res
                .status(404)
                .json(
                    resPayload(false, null, `Action to update does not exist`)
                );
        }
    }

    return next();
}
