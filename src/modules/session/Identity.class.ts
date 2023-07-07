import { isValidNumber } from '../../utils/commFunctions.util';
import { prisma } from '../../utils/prisma.util';

class Identity {
    userId: number; // assigned at object creation
    readonly modelName = 'User';

    constructor(id: number) {
        if (!isValidNumber(id)) {
            throw new Error(
                'Provided id for user identity initialization is not valid'
            );
        }
        this.userId = Number(id);
    }

    /**
     *For user id provided, confirm if user exists
     */

    public async isValidUser() {
        const user = await prisma.user.findUnique({
            where: {
                id: this.userId,
            },
        });

        return user ? true : false;
    }

    /**
     * returns the data of the user
     */
    async data() {
        return await prisma.user.findUnique({
            where: {
                id: this.userId,
            },
        });
    }

    async hasPermission(actionName: string) {
        if (!(await this.isValidUser())) return false;

        const action = await prisma.action.findFirst({
            where: {
                name: actionName,
            },
        });

        if (!action) {
            return false;
        }

        // roles that current user has been assigned to
        const userRoles = await prisma.userRoles.findMany({
            where: {
                userId: this.userId,
            },
        });

        let permisionFound = false;

        // find the first role with given permission and break
        for (let userRole of userRoles) {
            if (await this.roleHasPermission(userRole.roleId, action.id)) {
                permisionFound = true;
                break;
            }
        }

        return permisionFound;
    }

    /**
     *
     * @param roleId
     * @param actionId
     *
     * checks if a given role is mapped to an actions
     */
    private async roleHasPermission(roleId: number, actionId: number) {
        const permision = await prisma.permission.findFirst({
            where: {
                roleId: roleId,
                actionId: actionId,
            },
        });

        return permision ? true : false;
    }
}

export default Identity;
