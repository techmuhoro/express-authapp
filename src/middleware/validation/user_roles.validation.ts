import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../utils/prisma.util';

interface ErrorObj {
    for: string;
    message: string;
    value?: any;
}
export default async function validatePayload(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { userId, roleIds } = req.body;
    const errors: ErrorObj[] = [];

    if (typeof userId !== 'number') {
        errors.push({
            for: 'userId',
            message: 'User id should be a number',
            value: userId,
        });
    } else {
        // validate if user exists
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        if (!user) {
            errors.push({
                for: 'userId',
                message: 'Specified user does not exists',
                value: userId,
            });
        }
    }

    if (Array.isArray(roleIds)) {
        if (roleIds.length < 1) {
            errors.push({
                for: 'rolesIds',
                message: 'Provide atleast one role id',
                value: roleIds,
            });
        } else {
            for (let roleId of roleIds) {
                if (typeof roleId !== 'number') {
                    errors.push({
                        for: 'rolesIds',
                        message: 'All rolesIds should be number',
                        value: roleId,
                    });
                } else {
                    // validate role exists
                    const role = await prisma.role.findUnique({
                        where: {
                            id: roleId,
                        },
                    });

                    if (!role) {
                        errors.push({
                            for: 'roleIds',
                            message:
                                'One of the specified roles does not exists',
                            value: roleId,
                        });
                    }
                }
            }
        }
    } else {
        if (typeof roleIds !== 'number') {
            errors.push({
                for: 'rolesIds',
                message: 'Role id must be a number',
                value: roleIds,
            });
        } else {
            const role = await prisma.role.findUnique({
                where: {
                    id: roleIds,
                },
            });

            if (!role) {
                errors.push({
                    for: 'roleIds',
                    message: 'Role does not exists',
                });
            }
        }
    }

    if (errors.length > 0) {
        return res
            .status(400)
            .json({ success: false, data: null, errors: errors });
    }

    return next();
}
