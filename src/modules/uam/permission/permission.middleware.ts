import { Request, Response, NextFunction } from 'express';
import { prisma, getModelFields } from '../../../utils/prisma.util';
import { resPayload } from '../../../utils/response.util';

interface ErrorObj {
    for: string;
    message: string;
    value?: any;
}
export async function validatePostPayload(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { roleId, actionId } = req.body;

    const errors: ErrorObj[] = [];

    if (!roleId || isNaN(Number(roleId))) {
        errors.push({
            for: 'roleId',
            message: 'Provide a valid role id (number)',
        });
    } else {
        const role = await prisma.role.findUnique({
            where: {
                id: Number(roleId),
            },
        });
        if (!role) {
            return res
                .status(404)
                .json(
                    resPayload(
                        false,
                        null,
                        `Role id - ${roleId} does not exist`
                    )
                );
        }
    }
    if (Array.isArray(actionId)) {
        for (let id of actionId) {
            if (isNaN(Number(id))) {
                errors.push({
                    for: 'permissionId',
                    message: `One of the provided action id <${id}> is not valid. Only number allowed`,
                });
                break;
            } else {
                // assert that the action exists
                const action = await prisma.action.findUnique({
                    where: { id: Number(id) },
                });

                if (!action) {
                    return res
                        .status(400)
                        .json(
                            resPayload(
                                false,
                                null,
                                `one of the provided action - ${id} does not exists`
                            )
                        );
                }
            }
        }
    } else {
        if (!actionId || isNaN(Number(actionId))) {
            errors.push({
                for: 'permissionId',
                message: 'Provide a valid action id (number)',
            });
        } else {
            const action = await prisma.action.findUnique({
                where: { id: Number(actionId) },
            });

            if (!action) {
                return res
                    .status(404)
                    .json(
                        resPayload(
                            false,
                            null,
                            `Permission - ${actionId} does not exists`
                        )
                    );
            }
        }
    }

    if (errors.length > 0) {
        return res.status(400).json(resPayload(false, null, errors));
    }

    return next();
}
