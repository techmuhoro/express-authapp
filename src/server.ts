import express from 'express';
import { deserializeUser } from './middleware/auth.middleware';
import registerRoutes from './routes';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = 5500;

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// custom middleware
app.use(deserializeUser);

app.listen(PORT, () => {
    registerRoutes(app);
    console.log(`[SERVER]-> http://localhost:${PORT}`);
});
