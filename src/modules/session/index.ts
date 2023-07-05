import type { Express } from 'express';
import express from 'express';
import router from './session.routes';

export default function sessionRoutes(app: Express) {
    app.use('/api/session', router);
}
