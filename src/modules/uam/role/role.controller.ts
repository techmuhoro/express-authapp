import type { Request, Response } from 'express';
import { prisma } from '../../../utils/prisma.util';
import { resPayload } from '../../../utils/response.util';
import type { Role } from '@prisma/client';

export async function listRoles(req: Request, res: Response) {
    const roles = await prisma.role.findMany();

    return res.json(resPayload(true, roles));
}
export async function viewRole(req: Request, res: Response) {
    const { id: roleId } = req.params;

    if (!Number(roleId)) {
        return res
            .status(400)
            .json(resPayload(false, null, 'Role id should be a number'));
    }

    const role = await prisma.role.findUnique({
        where: {
            id: Number(roleId),
        },
    });

    return res.json(resPayload(true, role));
}

export async function createRole(req: Request, res: Response) {
    const { name, description } = req.body;

    if (!name || !description) {
        return res.status(400).send('Bad payload');
    }
    try {
        const role = await prisma.role.create({
            data: {
                name,
                description,
            },
        });

        return res.json(resPayload(true, role));
    } catch (e: any) {
        return res.status(500).json(resPayload(false, null, `${e.message}`));
    }
}
export async function updateRole(req: Request, res: Response) {
    const { id: roleId } = req.params;

    if (!Number(roleId)) {
        res.status(400).json(
            resPayload(false, null, 'Role id must be a number')
        );
    }

    const existing = await prisma.role.findUnique({
        where: {
            id: Number(roleId),
        },
    });

    if (!existing) {
        return res
            .status(404)
            .json(resPayload(false, null, 'Role does not exists'));
    }

    // columns that are editable over an api
    const whiteList = ['name', 'description'];

    const updatedData: any = {};

    for (let key in req.body) {
        if (whiteList.includes(key)) {
            updatedData[key] = req.body[key];
        }
    }

    try {
        const updatedRole = await prisma.role.update({
            where: {
                id: Number(roleId),
            },
            data: updatedData,
        });

        return res.json(resPayload(true, updatedRole));
    } catch (e: any) {
        console.log(e);
        return res.status(500).json(resPayload(false, null, `${e.message}`));
    }
}

export async function deleteRole(req: Request, res: Response) {
    const { id: roleId } = req.params;

    if (!Number(roleId)) {
        res.status(400).json(
            resPayload(false, null, 'Role id should be a number')
        );
    }
    const existing = await prisma.role.findUnique({
        where: { id: Number(roleId) },
    });

    if (!existing) {
        return res
            .status(404)
            .json(resPayload(false, null, `Role deos not exists`));
    }
    try {
        const deletedRole = await prisma.role.delete({
            where: {
                id: Number(roleId),
            },
        });

        return res.json(resPayload(true, deletedRole));
    } catch (e: any) {
        return res.status(500).json(resPayload(false, null, `${e.message}`));
    }
}
