import type { Request, Response } from 'express';
import { prisma } from '../../utils/prisma.util';
import { resPayload } from '../../utils/response.util';
import assignRole from '../../app/uam/AssignRole';

export async function listUserRoles(req: Request, res: Response) {
    const userRole = await prisma.userRoles.findMany();

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
    });

    return res.json(resPayload(true, userRole));
}

export async function createUserRoles(req: Request, res: Response) {
    const { userId, roleIds } = req.body;

    // create assignment
    const assignedRole = assignRole.assignRole(userId, roleIds);
}
