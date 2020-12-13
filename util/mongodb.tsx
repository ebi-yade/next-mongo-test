import { Db, MongoClient } from 'mongodb'

const { MONGODB_URI, MONGODB_DB } = process.env

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

if (!MONGODB_DB) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentiatlly
 * during API Route usage.
 */

declare global {
  namespace NodeJS {
    interface Global {
      mongo: {
        client: MongoClient,
        db: Db,
      }
    }
  }
}

let cached = global.mongo

/**
 * Asynchronously establish a connection to the MongoDB database.
 */
export const connectToDatabase = async () => {
  if (cached === undefined) {
    const client = await new MongoClient(MONGODB_URI ?? '', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).connect()
    cached = {
      client: client,
      db: client.db('sightings'),
    }
  } else if (!cached.client.isConnected()) {
    await cached.client.connect()
  }
  return cached
}
