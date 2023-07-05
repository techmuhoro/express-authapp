import type { Request, Response } from 'express';
import { prisma } from '../../utils/prisma.util';

export async function listUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany();

    return res.json({ success: true, data: users });
}
export async function viewUser(req: Request, res: Response) {
    const { id: userId } = req.params;

    if (!Number(userId)) {
        return res.status(400).json({
            success: false,
            errors: 'Id should be a number',
        });
    }

    const user = await prisma.user.findUnique({
        where: {
            id: Number(userId),
        },
    });

    return res.json({ success: true, data: user });
}

export async function createUser(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            errors: [{ for: 'name', message: 'Name is required' }],
        });
    }

    if (!email) {
        return res.status(400).json({
            success: false,
            errors: [{ for: 'email', message: 'Email is required' }],
        });
    }

    if (!password) {
        return res.status(400).json({
            success: false,
            errors: [{ for: 'password', message: 'Password is required' }],
        });
    }

    // validate if email is unique
    const existing = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (existing) {
        return res.status(400).json({
            success: false,
            errors: [
                {
                    for: 'email',
                    message: 'Email should be unquie',
                },
            ],
        });
    }

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
            },
        });

        const { password: pass, ...userWithoutPass } = user;

        return res.json({
            success: true,
            data: userWithoutPass,
        });
    } catch (e: any) {
        return res.status(500).json({
            success: false,
            errors: `${e.message} : contact system admin`,
        });
    }
}

export function updateUser(req: Request, res: Response) {}
export function deleteUser(req: Request, res: Response) {}
