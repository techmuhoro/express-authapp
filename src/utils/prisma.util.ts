import { PrismaClient, Prisma } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export function getModelFields(modelName: string) {
    if (!modelName) {
        return null;
    }

    const model = Prisma.dmmf.datamodel.models.find(
        model => model.name == modelName
    );

    const fields = model?.fields
        ? model.fields
              .filter(field => field.kind !== 'object')
              .map(field => field.name)
        : null;

    console.log(model?.fields);

    return fields;
}
