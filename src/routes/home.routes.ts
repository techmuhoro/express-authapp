import { Request, Response, Express } from 'express';
import { User, PrismaClient } from '@prisma/client';
import { prisma } from '../utils/prisma.util';
import { requireUser, requirePermission } from '../middleware/auth.middleware';

function homeRoutes(app: Express) {
    app.get('/api', async (req: Request, res: Response) => {
        const user = await prisma.user.findUnique({
            where: {
                id: 1,
            },
        });

        user?.id;

        return res.send('Hello Api!');
    });

    app.get(
        '/api/auth-test',
        [requireUser, requirePermission('deleteUsers')],
        testHandler
    );
}

async function testHandler(req: Request, res: Response) {
    res.send('test hello');
}
export default homeRoutes;
