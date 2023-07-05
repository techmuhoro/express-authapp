import { Request, Response, Express } from 'express';

function homeRoutes(app: Express) {
    app.get('/api', (req: Request, res: Response) => {
        return res.send('Hello Api!');
    });
}

export default homeRoutes;
