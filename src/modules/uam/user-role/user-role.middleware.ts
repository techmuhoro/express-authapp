import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../utils/prisma.util';
import { resPayload } from '../../../utils/response.util';

interface ErrorObj {
    for: string;
    message: string;
    value?: any;
}
/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 *
 * Validate checks
 *      1. userId is a valid number and user exists
 *      2. roleId or roleIds is an array are valid number and they exists
 */

async function getUserRole(userRoleId: number) {
    return await prisma.userRoles.findUnique({
        where: {
            id: userRoleId,
        },
    });
}

function isValidNumber(num: string | number) {
    return !isNaN(Number(num));
}
export async function validatePayload(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { userId, roleIds } = req.body;
    const errors: ErrorObj[] = [];

    // userId validatiom
    if (!isValidNumber(userId)) {
        errors.push({
            for: 'userId',
            message: 'User id should be a number',
            value: userId,
        });
    } else {
        // validate if user exists
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId),
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

    // Role id validation
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
        if (!isValidNumber(roleIds)) {
            errors.push({
                for: 'rolesIds',
                message: 'Role id must be a number',
                value: roleIds,
            });
        } else {
            const role = await prisma.role.findUnique({
                where: {
                    id: Number(roleIds),
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

export async function requireIdParam(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { id } = req.params;
    console.log(id, typeof id);

    if (!isValidNumber(id)) {
        return res
            .status(400)
            .json(
                resPayload(
                    false,
                    null,
                    `Provide a valid user role id - (number)`
                )
            );
    }

    if (!(await getUserRole(Number(id)))) {
        return res
            .status(404)
            .json(resPayload(false, null, `User role was not foud`));
    }

    return next();
}
