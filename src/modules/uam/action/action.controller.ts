import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../utils/prisma.util';
import { resPayload } from '../../../utils/response.util';

export async function listActions(req: Request, res: Response) {
    const actions = await prisma.action.findMany();

    return res.json(resPayload(true, actions));
}

export async function viewAction(req: Request, res: Response) {
    const { id: actionId } = req.params;

    try {
        const action = await prisma.action.findUnique({
            where: {
                id: Number(actionId),
            },
        });

        return res.json(resPayload(true, action));
    } catch (e: any) {
        return res.status(500).json(resPayload(false, null, `${e.message}`));
    }
}

export async function createAction(req: Request, res: Response) {
    const { name, description, actionCategoryId } = req.body;

    try {
        const action = await prisma.action.create({
            data: {
                name,
                description,
                actionCategoryId,
            },
        });

        return res.json(resPayload(true, action));
    } catch (e: any) {
        return res.status(500).json(resPayload(false, null, `${e.message}`));
    }
}

export async function updateAction(req: Request, res: Response) {
    const { id: actionId } = req.params;
    const updateData: any = {};
    const whitelist = ['name', 'description'];

    for (let key in req.body) {
        if (whitelist.includes(key)) {
            updateData[key] = req.body[key];
        }
    }

    try {
        //
        const action = await prisma.action.update({
            where: {
                id: Number(actionId),
            },
            data: updateData,
        });

        return res.json(resPayload(true, action));
    } catch (e: any) {
        return res.status(500).json(resPayload(false, null, `${e.message}`));
    }
}

export async function deleteAction(req: Request, res: Response) {
    const { id: actionId } = req.params;

    try {
        const action = await prisma.action.delete({
            where: {
                id: Number(actionId),
            },
        });

        return res.json(resPayload(true, action));
    } catch (e: any) {
        return res.status(500).json(resPayload(false, null, `${e.message}`));
    }
}
