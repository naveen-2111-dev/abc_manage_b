import { Collection, getCollection } from "@/helper/db/get_collection";
import { Hash } from "@/helper/hash";
import { RegisterInput } from "./register.schema";

export class RegisterModel {
    private readonly input: RegisterInput;

    constructor(name: string, email: string, password: string) {
        this.input = { name, email, password };
    }

    async register() {
        const collection = await getCollection(Collection.USER);
        const hash = new Hash(this.input.password);
        const res = await collection.insertOne({
            name: this.input.name,
            email: this.input.email,
            password: await hash.hash(),
            role: "member"
        });

        return res;
    }

    async existingUser(): Promise<boolean> {
        const collection = await getCollection(Collection.USER);
        const res = await collection.findOne({ email: this.input.email });
        return !!res;
    }
}