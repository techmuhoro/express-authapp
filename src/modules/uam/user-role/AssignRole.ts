import { prisma } from '../../../utils/prisma.util';
import type { User } from '@prisma/client';

class AssignRole {
    constructor() {}

    async assign(userId: number, roleId: number | number[]) {
        if (typeof roleId === 'number') {
            if (!(await this.checkIfAssigned(userId, Number(roleId)))) {
                return await this.createMapping(userId, roleId as number);
            }

            return null;
        } else if (Array.isArray(roleId)) {
            const createdUserRoles = [];

            // loop over the roles and assign
            for (let role of roleId) {
                const isAssigned = await this.checkIfAssigned(
                    userId,
                    Number(role)
                );
                // if role is already assigned jump to the next loop,
                if (isAssigned) continue;

                const createdUserRole = await this.createMapping(userId, role);
                // procced to assign
                createdUserRoles.push(createdUserRole);
            }

            return createdUserRoles;
        }

        return null;
    }

    async revoke(userRoleId: number) {
        try {
            const deletedRole = await prisma.userRoles.delete({
                where: {
                    id: userRoleId,
                },
            });

            return deletedRole;
        } catch (e) {
            return null;
        }
    }

    // confirm if role is not already assigned
    async checkIfAssigned(userId: number, roleId: number) {
        const assinged = await prisma.userRoles.findFirst({
            where: {
                userId: userId,
                roleId: roleId,
            },
        });

        return assinged ? true : false;
    }

    async roleExists(roleId: number) {
        const role = await prisma.role.findUnique({
            where: {
                id: roleId,
            },
        });

        return role ? true : false;
    }

    async createMapping(userId: number, roleId: number) {
        const userRole = await prisma.userRoles.create({
            data: {
                userId: userId,
                roleId: roleId,
            },
        });

        return userRole;
    }
}

export default new AssignRole();
