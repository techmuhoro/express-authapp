import type { Request, Response } from "express";
import { prisma } from "../../../utils/prisma.util";
import bcrypt, { hash } from "bcrypt";
import { resPayload } from "../../../utils/response.util";

export async function listUsers(req: Request, res: Response) {
    const users = await prisma.user.findMany();

    return res.json({ success: true, data: users });
}

export async function viewUser(req: Request, res: Response) {
    const { id: userId } = req.params;

    if (!Number(userId)) {
        return res.status(400).json({
            success: false,
            errors: "Id should be a number",
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

    const passwordHash = bcrypt.hashSync(password, 10);

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
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

export async function changePassword(req: Request, res: Response) {
    const { email, password, newPassword } = req.body;

    const user = await prisma.user.findUnique({
        where: {
            email: email,
        },
    });
    console.log(user);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res
            .status(400)
            .json(resPayload(false, null, `Invalid old password`));
    }

    const updatedUser = await prisma.user.update({
        where: {
            email: email,
        },
        data: {
            password: bcrypt.hashSync(newPassword, 10),
        },
    });

    if (!updatedUser) {
        return res
            .status(500)
            .json(
                resPayload(
                    false,
                    null,
                    "Could no update password. Contact system admin"
                )
            );
    }
    // remove password
    const { password: userPass, ...userWithoutPass } = updatedUser;

    return res.json(resPayload(true, userWithoutPass));
}

export function resetPassword(req: Request, res: Response) {
    // log some mails
}

export function deleteUser(req: Request, res: Response) {}
