import type { Request, Response } from 'express';
import { signJwt, verifyJwt } from '../../utils/jwt.util';

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

export function createSession(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = users.find(user => user.email == email);

    if (!user || user.password !== password) {
        return res.status(403).json({
            succes: false,
            error: 'Invalid email or password',
        });
    }

    const accessToken = signJwt({ name: user.name, email: user.email }, '10s');
    // const refreshToken = signJwt({ name: user.name, email: user.email }, '1y');

    return res.json({
        sucess: true,
        data: {
            user: { name: user.name, email: user.email },
            accessToken,
        },
    });
}

export function deleteSession(req: Request, res: Response) {
    res.json('Delete session');
}
