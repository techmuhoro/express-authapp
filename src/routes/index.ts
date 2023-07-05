import type { Express } from 'express';
import uamRoutes from '../modules/uam';
import sessionRoutes from '../modules/session';
import homeRoutes from './home.routes';

function registerRoutes(app: Express) {
    uamRoutes(app);
    sessionRoutes(app);
    homeRoutes(app);
}

export default registerRoutes;
