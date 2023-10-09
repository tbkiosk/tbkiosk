import { PrismaClient } from '@prisma/client'

export const prismaClient = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismaClient
