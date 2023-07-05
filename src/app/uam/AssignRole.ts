import { prisma } from '../../utils/prisma.util';
import type { User } from '@prisma/client';

class AssignRole {
    constructor() {}

    async assignRole(userId: number, roleId: number | number[]) {
        userId = Number(userId);

        if (typeof roleId === 'number') {
            if (!(await this.checkIfAssign(userId, Number(roleId)))) {
                // proccedd to assign
                const userRole = await prisma.userRoles.create({
                    data: {
                        userId: Number(userId),
                        roleId: Number(roleId),
                    },
                });

                return { success: true, data: userRole };
            }

            return { success: false, error: 'Role is already assigned' };
        } else if (Array.isArray(roleId)) {
            const createdUserRoles = [];
            const errors: string[] = [];

            // loop over the roles and assign
            for (let role of roleId) {
                // if role does not exist jump to the next loop
                if (!(await this.roleExists(Number(roleId)))) {
                    errors.push(`Role with id ${role} does not exist`);
                    continue;
                }
                // if role is already assigned jump to the next loop,
                if (!(await this.checkIfAssign(userId, Number(roleId)))) {
                    errors.push(`Role with id ${role} is already assigned`);
                    continue;
                }

                // procced to assign
                const userRole = await prisma.userRoles.create({
                    data: {
                        userId: userId,
                        roleId: Number(role),
                    },
                });

                createdUserRoles.push(userRole);
            }

            return {
                success: true,
                data:
                    createdUserRoles.length > 0
                        ? createdUserRoles.filter(Boolean)
                        : null,
                error: errors.length > 0 ? errors : null,
            };
        }
    }

    // confirm if role is not already assigned
    async checkIfAssign(userId: number, roleId: number) {
        const assinged = await prisma.userRoles.findFirst({
            where: {
                userId: userId,
                roleId: roleId,
            },
        });

        return assinged ? true : false;
    }

    async roleExists(roleId: number) {
        roleId = Number(roleId);

        const role = await prisma.role.findUnique({
            where: {
                id: roleId,
            },
        });

        return role ? true : false;
    }
}

export default new AssignRole();
