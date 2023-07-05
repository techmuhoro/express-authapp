import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../utils/prisma.util';
import { resPayload } from '../../../utils/response.util';

interface ErrorObj {
    for: string;
    message: string;
    value?: any;
}

export async function validateUserCreate(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { name, email, password } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            errors: [{ for: 'name', message: 'Name is required' }],
        });
    }

    if (!email) {
        return res.status(400).json({
            success: false,
            errors: [{ for: 'email', message: 'Email is required' }],
        });
    }

    if (!password) {
        return res.status(400).json({
            success: false,
            errors: [{ for: 'password', message: 'Password is required' }],
        });
    }

    // validate if email is unique
    const existing = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existing) {
        return res.status(400).json({
            success: false,
            errors: [
                {
                    for: 'email',
                    message: 'Email should be unquie',
                },
            ],
        });
    }

    return next();
}
export async function validateChangePass(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { email, password, newPassword } = req.body;

    const errors: ErrorObj[] = [];
    if (!email) {
        errors.push({
            for: 'email',
            message: 'Email is required',
            value: email,
        });
    } else {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return res
                .status(400)
                .json(resPayload(false, null, `User does not exist`));
        }
    }

    if (!password) {
        errors.push({
            for: 'password',
            message: 'Password is required',
            value: password,
        });
    }

    if (!newPassword) {
        errors.push({
            for: 'newPassword',
            message: 'New Password is required',
            value: newPassword,
        });
    }

    if (errors.length > 0) {
        return res.status(400).json(resPayload(false, null, errors));
    }

    return next();
}
