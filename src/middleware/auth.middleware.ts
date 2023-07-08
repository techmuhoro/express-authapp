import type { Request, Response, NextFunction } from 'express';
import { signJwt, verifyJwt } from '../utils/jwt.util';
import { prisma } from '../utils/prisma.util';
import Identity from '../modules/session/Identity.class';
import type { JwtPayload } from 'jsonwebtoken';
import { resPayload } from '../utils/response.util';

/**
 *
 * @param req Request
 * @param res Response
 * @param next NextFunction
 *
 * For a given request, if there is valid accessToken in authorization header, append the user to the request
 */
export async function deserializeUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { authorization: token, refreshToken } = req.headers;

    if (!token) {
        return next();
    }

    const decoded = verifyJwt(token);

    if (decoded.payload) {
        if (typeof decoded.payload != 'string') {
            req.user = new Identity(decoded.payload.id);
        }
    }

    if (!decoded.payload && decoded.expired) {
        // refresh the token
        if (typeof refreshToken === 'string') {
            const decodedRefresh = verifyJwt(refreshToken);
            if (decodedRefresh.payload) {
                // check if there is a valid existing session
                const session = await prisma.session.findFirst({
                    where: {
                        // @ts-ignore
                        id: decodedRefresh.payload.sessionId,
                        valid: true, // only return valid session
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                });

                // if (session) {
                // }
            }
        }
    }

    return next();
}

export async function deserializeUser2(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken) return next();

    const { payload, expired } = verifyJwt(accessToken);

    if (payload) {
        if (typeof payload !== 'string') {
            req.user = new Identity(payload.id);
        }

        return next();
    }

    // if expired and there is a valid refresh token, re-authenticate
    if (expired && refreshToken) {
        const decoded = verifyJwt(refreshToken);

        if (decoded.payload && typeof decoded.payload !== 'string') {
            // look up the user session
            const session = await prisma.session.findFirst({
                where: {
                    id: Number(decoded.payload.sessionId),
                    valid: true, // only valid session
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });

            if (session) {
                const { user } = session;
                const newAccessToken = signJwt(
                    {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                    },
                    '20s'
                );

                res.cookie('accessToken', newAccessToken, {
                    maxAge: 24 * 60 * 60 * 1000, // 24 hours
                    httpOnly: true,
                });

                req.user = new Identity(user.id);
            }
        }
    }

    return next();
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res
            .status(401)
            .json({ success: false, error: 'Not authnticated' });
    }

    return next();
}

export function requirePermission(permisionName: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!(await req.user?.hasPermission(permisionName))) {
            return res
                .status(400)
                .json(
                    resPayload(
                        false,
                        null,
                        `$You don not has permission - ${permisionName}`
                    )
                );
        }

        return next();
    };
}
