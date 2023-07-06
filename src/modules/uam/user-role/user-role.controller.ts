import type { Request, Response } from 'express';
import { prisma } from '../../../utils/prisma.util';
import { resPayload } from '../../../utils/response.util';
import assignRole from './AssignRole';

export async function listUserRoles(req: Request, res: Response) {
    const userRole = await prisma.userRoles.findMany({
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
            role: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return res.json(resPayload(true, userRole));
}
export async function viewUserRole(req: Request, res: Response) {
    const { id: userRoleId } = req.params;

    if (!Number(userRoleId)) {
        return res
            .status(400)
            .json(resPayload(false, null, 'userRoleId must be a number'));
    }

    const userRole = await prisma.userRoles.findUnique({
        where: { id: Number(userRoleId) },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
            role: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    return res.json(resPayload(true, userRole));
}

export async function createUserRoles(req: Request, res: Response) {
    const { userId, roleIds } = req.body;

    // create assignment
    const transformedRoleIds = Array.isArray(roleIds)
        ? roleIds.map((id: string) => Number(id))
        : Number(roleIds);

    const assignedRole = await assignRole.assign(
        Number(userId),
        transformedRoleIds
    );

    if (!assignedRole) {
        return res
            .status(400)
            .json(resPayload(false, null, `could not create user roles`));
    }

    return res.json(resPayload(true, assignedRole));
}

export async function deleteUserRole(req: Request, res: Response) {
    const { id } = req.params;

    const rovokedRole = await assignRole.revoke(Number(id));

    if (!rovokedRole) {
        res.status(400).json(resPayload(false, null, `Could not revoke role!`));
    }

    return res.json(resPayload(true, rovokedRole));
}
