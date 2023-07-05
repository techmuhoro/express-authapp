interface User {
    name: string;
    email: string;
}

declare module Express {
    export interface Request {
        user: User;
    }
}
