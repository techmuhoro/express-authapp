import express from 'express';
import type { Request, Response } from 'express';
import { homeHanlder } from './controllers/session.controller';
import { deserializeUser } from './middleware/auth.middleware';
import registerRoutes from './routes';

const app = express();
const PORT = 5500;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// custom middleware
app.use(deserializeUser);

app.listen(PORT, () => {
    registerRoutes(app);
    console.log(`[SERVER]-> http://localhost:${PORT}`);
});
