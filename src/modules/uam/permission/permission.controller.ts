import { Request, Response } from 'express';
import { prisma, getModelFields } from '../../../utils/prisma.util';
import { resPayload } from '../../../utils/response.util';
import assignPermission from './AssignPermission.class';

export async function listPermission(req: Request, res: Response) {
    const permissions = await prisma.permission.findMany();

    return res.json(resPayload(true, permissions));
}

export async function viewPermission(req: Request, res: Response) {}
export async function createPermission(req: Request, res: Response) {
    let { roleId, actionId } = req.body;

    if (typeof actionId === 'string' || typeof actionId === 'number') {
        actionId = Number(actionId);
    }

    if (Array.isArray(actionId)) {
        actionId = actionId.map(id => Number(id));
    }

    const data = await assignPermission.assign(Number(roleId), actionId);

    return res.json(resPayload(true, data));
}
export async function updatePermission(req: Request, res: Response) {}
export async function deletePermission(req: Request, res: Response) {}
