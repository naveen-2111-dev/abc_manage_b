import { MongoClient, ServerApiVersion } from "mongodb";
import { EnvConfig } from "@/config/env_config";

declare global {
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = EnvConfig.getMongoUri();

let client: MongoClient;

if (!globalThis._mongoClientPromise) {
    client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    globalThis._mongoClientPromise = client.connect();
}

const clientPromise: Promise<MongoClient> = globalThis._mongoClientPromise;

export default clientPromise;