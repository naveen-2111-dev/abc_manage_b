import { EnvConfig } from "@/config/env_config";
import { LoginModel } from "./login.model";
import { LoginInput, loginSchema } from "./login.schema";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export class LoginService {
    async login(input: LoginInput) {
        try {
            const { email, password } = input;
            const loginModel = new LoginModel(email, password);

            const validation = await loginSchema.safeParseAsync(input);

            if (!validation.success) {
                const errorMessages = validation.error.issues
                    .map((err) => err.message)
                    .join(", ");
                throw new Error(`Validation failed: ${errorMessages}`);
            }

            const res = await loginModel.login();

            const payload = {
                sub: res._id,
                role: res.role,
            };

            let token: string;
            let refreshToken: string;

            if (res.role === "member") {
                token = jwt.sign(
                    payload,
                    EnvConfig.getJwtMemberSecret(),
                    { expiresIn: "1h" }
                );

                refreshToken = jwt.sign(
                    payload,
                    EnvConfig.getJwtMemberRefreshSecret(),
                    { expiresIn: "7d" }
                );
            } else if (res.role === "admin") {
                token = jwt.sign(
                    payload,
                    EnvConfig.getAdminJwtSecret(),
                    { expiresIn: "1h" }
                );

                refreshToken = jwt.sign(
                    payload,
                    EnvConfig.getAdminJwtRefreshSecret(),
                    { expiresIn: "7d" }
                );
            } else {
                throw new Error("Invalid role");
            }

            const cookieStore = await cookies();

            cookieStore.set("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                maxAge: 60 * 60,
                path: "/",
            });

            cookieStore.set("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            });

            return {
                id: res._id,
                email: res.email,
                role: res.role,
            };
        } catch (error) {
            throw new Error("Authentication failed", error instanceof Error ? { cause: error } : undefined);
        }
    }
}