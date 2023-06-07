import { MongoClient } from 'mongodb'
import { PrismaClient } from '@prisma/client'

declare global {
  var _mongoClientPromise: Promise<MongoClient> // eslint-disable-line no-var
  var prisma: PrismaClient | undefined // eslint-disable-line no-var
}
