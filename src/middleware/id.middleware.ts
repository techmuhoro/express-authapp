import { Request, Response, NextFunction } from 'express';
import { resPayload } from '../utils/response.util';
import { prisma } from '../utils/prisma.util';
import { Prisma, PrismaClient } from '@prisma/client';
/**
 * Given a model and this function will return a middleware to ensure
 *      1. The id is a valid nuber,
 *      2. There is a record with that id
 */

type ModelName = keyof PrismaClient;

export async function requireIdMiddleware(modelName: ModelName) {
    return function (req: Request, res: Response, next: NextFunction) {
        const { id } = req.params;

        if (isNaN(Number(id))) {
            return res
                .status(400)
                .json(
                    resPayload(
                        false,
                        null,
                        `Provide a valid id param - (number)`
                    )
                );
        }
    };
}
