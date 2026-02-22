import mongoose from "mongoose";


const MONGO_URI = process.env.MONGODB_URI as string;

if (!MONGO_URI || (!MONGO_URI.startsWith("mongodb://") && !MONGO_URI.startsWith("mongodb+srv://"))) {
    throw new Error("Please define the MONGO_URI environment variable with a valid MongoDB connection string");
}


interface GlobalMongoose {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongooseGlobal: GlobalMongoose | undefined;
}


let cached = global.mongooseGlobal;
if (!cached) {
    cached = global.mongooseGlobal = {
        conn: null,
        promise: null
    }
}

export async function connectDB() {
    if (cached!.conn) {
        return cached!.conn;
    }

    if (!cached!.promise) {
            mongoose.set("strictQuery", true);

            
        cached!.promise = mongoose.connect(MONGO_URI as string, {
            bufferCommands: false
        }).catch((err) => {
           throw new Error(`Error connecting to MongoDB: ${err.message}`);
        });
    }

    cached!.conn = await cached!.promise;
    return cached!.conn;
}


