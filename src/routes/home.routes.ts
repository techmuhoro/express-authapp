import { Request, Response, Express } from 'express';
import { User, PrismaClient } from '@prisma/client';
import { prisma } from '../utils/prisma.util';

function homeRoutes(app: Express) {
    app.get('/api', async (req: Request, res: Response) => {
        const r = await prisma.userRoles.delete({
            where: {
                id: 55,
            },
        });
        console.log(r);
        return res.send('Hello Api!');
    });
}

export default homeRoutes;
