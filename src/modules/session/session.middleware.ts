import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../../utils/jwt.util';

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
        // @ts-ignore
        req.user = decoded.payload;
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
