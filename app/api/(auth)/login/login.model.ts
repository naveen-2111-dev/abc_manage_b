import { Collection, getCollection } from "@/helper/db/get_collection";
import { LoginInput } from "./login.schema";
import { Hash } from "@/helper/hash";

export interface LoginModelResponse {
    _id: string;
    email: string;
    role: string;
}

export class LoginModel {
    private readonly input: LoginInput;

    constructor(email: string, password: string) {
        this.input = { email, password };
    }

    async login(): Promise<LoginModelResponse> {
        const collection = await getCollection(Collection.USER);
        const user = await collection.findOne({ email: this.input.email });

        if (!user) {
            throw new Error("User not found");
        }

        const match = await new Hash(this.input.password).compare(user.password);

        if (!match) {
            throw new Error("Invalid password");
        }

        return {
            _id: user._id.toString(),
            email: user.email,
            role: user.role,
        };
    }
}