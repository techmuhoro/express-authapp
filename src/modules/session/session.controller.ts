import type { Request, Response } from 'express';
import { signJwt, verifyJwt } from '../../utils/jwt.util';
import bcrypt from 'bcrypt';
import { resPayload } from '../../utils/response.util';
import { prisma } from '../../utils/prisma.util';

const users = [
    { name: 'James Muhoro', email: 'hi@james.com', password: '1234' },
    { name: 'Peter Muga', email: 'hi@muga.com', password: '1234' },
];
export function homeHanlder(req: Request, res: Response) {
    res.json('Application works!');
}

export function getSession(req: Request, res: Response) {
    const { authorization: token } = req.headers;

    res.json({
        success: true,
        data: req.user,
    });
}

export async function createSession(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json(resPayload(false, null, `Provide all credentials`));
    }

    const user = await prisma.user.findFirst({
        where: {
            email,
        },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res
            .status(403)
            .json(resPayload(false, null, 'Invalid email or password'));
    }

    // create a session
    const session = await prisma.session.create({
        data: {
            valid: true,
            userId: user.id,
        },
    });

    const accessToken = signJwt(
        { id: user.id, name: user.name, email: user.email },
        '20s'
    );

    const refreshToken = signJwt({ sessionId: session.id }, '30d');

    // set the cookies for authentication
    res.cookie('accessToken', accessToken, {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true,
    });

    res.cookie('refreshToken', refreshToken, {
        maxAge: 12 * 30 * 24 * 60 * 60 * 1000, // cookie
        httpOnly: true,
    });

    return res.json(
        resPayload(true, {
            user: { name: user.name, email: user.email },
            accessToken,
            refreshToken,
        })
    );
}

export function deleteSession(req: Request, res: Response) {
    res.json('Delete session');
}
