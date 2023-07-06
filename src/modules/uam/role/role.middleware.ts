import { Request, Response, NextFunction } from 'express';
import { resPayload } from '../../../utils/response.util';
import { prisma } from '../../../utils/prisma.util';

export async function requireIdParam(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { id: roleId } = req.body;

    if (isNaN(Number(roleId))) {
        return res
            .status(400)
            .json(resPayload(false, null, `Provide a valid role id (number)`));
    }

    const role = await prisma.role.findFirst({
        where: {
            id: Number(roleId),
        },
    });

    if (!role) {
        return res
            .status(400)
            .json(resPayload(false, null, `Role id Not found`));
    }

    return next();
}
