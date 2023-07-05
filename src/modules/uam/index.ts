import type { Express } from 'express';
import actionCategoryRoutes from './actionCategory/actionCategory.routes';
import actionRoutes from './action/action.routes';
import permissionRoutes from './permission/permission.routes';
import roleRoutes from './role/role.routes';
import userRoutes from './user/user.routes';
import userRolesRoutes from './user-role/user-role.routes';

function uamRoutes(app: Express) {
    app.use('/api/uam/user', userRoutes);
    app.use('/api/uam/role', roleRoutes);
    app.use('/api/uam/user-role', userRolesRoutes);
    app.use('/api/uam/action-category', actionCategoryRoutes);
    app.use('/api/uam/action', actionRoutes);
    app.use('/api/uam/permission', permissionRoutes);
}

export default uamRoutes;
