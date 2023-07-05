import type { Request, Response } from 'express';
import { resPayload } from '../../../utils/response.util';
import { prisma } from '../../../utils/prisma.util';
import { Prisma } from '@prisma/client';

export async function listActionCategories(req: Request, res: Response) {
    const data = await prisma.actionCategory.findMany();

    return res.json(resPayload(true, data));
}

export async function viewActionCategory(req: Request, res: Response) {
    const { id } = req.params;

    const actionCategory = await prisma.actionCategory.findUnique({
        where: {
            id: Number(id),
        },
    });

    if (actionCategory) {
        return res.json(resPayload(true, actionCategory));
    }

    return res.status(404).json(resPayload(false, null, 'Not found'));
}
export async function createActionCategory(req: Request, res: Response) {
    const { name, description } = req.body;

    try {
        const actionCategory = await prisma.actionCategory.create({
            data: {
                name: name,
                description: description,
            },
        });

        return res.json(resPayload(true, actionCategory));
    } catch (e: any) {
        return res.status(500).json(resPayload(false, null, `${e.message}`));
    }
}
export async function updateActionCategory(req: Request, res: Response) {
    const { id } = req.params;

    const whiteList = ['name', 'description'];

    const updatePayload: any = {};

    for (let key in req.body) {
        if (whiteList.includes(key)) {
            if (req.body[key]) updatePayload[key] = req.body[key];
        }
    }
    try {
        const actionCategory = await prisma.actionCategory.update({
            where: {
                id: Number(id),
            },
            data: updatePayload,
        });

        return res.json(resPayload(true, actionCategory));
    } catch (e: any) {
        return res.status(500).json(resPayload(false, null, `${e.message}`));
    }
}
export async function deleteActionCategory(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const deletedActionCategory = await prisma.actionCategory.delete({
            where: { id: Number(id) },
        });

        return res.json(resPayload(true, deletedActionCategory));
    } catch (e: any) {
        res.status(500).json(resPayload(false, null, `${e.message} --`));
    }
}
