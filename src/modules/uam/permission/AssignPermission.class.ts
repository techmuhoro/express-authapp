import { prisma } from '../../../utils/prisma.util';
class AssignPermission {
    constructor() {}

    async assign(roleId: number, actionId: number | number[]) {
        if (Array.isArray(actionId)) {
            const createdPermissions = [];

            // loop over and assign
            for (let id of actionId) {
                if (!(await this.checkAssigned(roleId, id))) {
                    const permision = await this.createPermission(roleId, id);
                    createdPermissions.push(permision);
                }
            }
        } else {
            if (!(await this.checkAssigned(roleId, actionId))) {
                return await this.createPermission(roleId, actionId);
            }
        }
    }
    /**
     *
     * @param roleId
     * @param actionId
     *
     * With given params, it created a permisions
     */
    async createPermission(roleId: number, actionId: number) {
        const permision = await prisma.permission.create({
            data: {
                roleId: roleId,
                actionId: actionId,
            },
        });

        return permision;
    }

    /**
     *
     * @param roleId
     * @param actionId
     *
     * Check if there is an already existing permission
     */
    async checkAssigned(roleId: number, actionId: number) {
        const permission = await prisma.permission.findFirst({
            where: {
                roleId: roleId,
                actionId: actionId,
            },
        });

        return permission;
    }
}

export default new AssignPermission();
