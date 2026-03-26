import { RegisterModel } from "./register.model";
import { registerSchema } from "./register.schema";

export class RegisterService {
    async register(name: string, email: string, password: string, dept: string) {
        const registerModel = new RegisterModel(name, email, password, dept);

        const payload = { name, email, password, dept };

        const validation = await registerSchema.safeParseAsync(payload);

        if (!validation.success) {
            const errorMessages = validation.error.issues.map((err) => err.message).join(", ");
            throw new Error(`Validation failed: ${errorMessages}`);
        }

        const existingUser: boolean = await registerModel.existingUser();

        if (existingUser) {
            throw new Error("User with this email already exists");
        }

        const res = await registerModel.register();
        return res;
    }
}