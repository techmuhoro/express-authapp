import { Request, Response } from 'express';
import { prisma, getModelFields } from '../../../utils/prisma.util';
import { resPayload } from '../../../utils/response.util';
import assignPermission from './AssignPermission.class';

export async function listPermission(req: Request, res: Response) {
    const permissions = await prisma.permission.findMany();

    return res.json(resPayload(true, permissions));
}

export async function viewPermission(req: Request, res: Response) {
    const { id: permisionId } = req.params;

    const permision = await prisma.permission.findUnique({
        where: {
            id: Number(permisionId),
        },
    });

    return res.json(resPayload(true, permision));
}

export async function createPermission(req: Request, res: Response) {
    let { roleId, actionId } = req.body;

    // convert actionId to type numbers
    const transformedActionIds = Array.isArray(actionId)
        ? actionId.map((id) => Number(id))
        : Number(actionId);

    const data = await assignPermission.assign(
        Number(roleId),
        transformedActionIds
    );

    return res.json(resPayload(true, data));
}
export async function updatePermission(req: Request, res: Response) {}
export async function deletePermission(req: Request, res: Response) {
    const { id: permisionId } = req.params;

    const revokedPermission = await assignPermission.revoke(
        Number(permisionId)
    );

    return res.json(resPayload(true, revokedPermission));
}
