import type { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt.util';
import { prisma } from 'src/utils/prisma.util';
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
export function deserializeUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { authorization: token } = req.headers;

    if (!token) {
        return next();
    }

    const decoded = verifyJwt(token);

    if (decoded.payload) {
        if (typeof decoded.payload != 'string') {
            req.user = new Identity(decoded.payload.id);
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
