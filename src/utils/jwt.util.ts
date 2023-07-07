import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';

// TODO: move to .env file
const SECRET_KEY = 'Eh8WEZiuWg4VQourGv9SGL71zmjJNwQ5sqoDxDLXZdoYXoJwBMr/RA==';

export function signJwt(payload: JwtPayload, expiresIn: string) {
    const token = jwt.sign(payload, SECRET_KEY, {
        expiresIn: '1h',
    });

    return token;
}

interface ReturnPayload {
    payload: JwtPayload | string;
    expired: boolean;
}

export function verifyJwt(token: string): ReturnPayload {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        return { payload: decoded, expired: false };
    } catch (e: any) {
        return {
            payload: null!,
            expired: e.message.includes('jwt expired'),
        };
    }
}
