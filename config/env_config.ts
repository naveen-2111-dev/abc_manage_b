export class EnvConfig {
    public static getMongoUri(): string {
        const uri = process.env.MONGODB_URI;

        if (!uri) {
            throw new Error(
                "MONGODB_URI is not defined in the environment variables.",
            );
        }

        return uri;
    }

    public static getJwtMemberSecret(): string {
        const secret = process.env.JWT_MEMBER_SECRET;
        if (!secret) {
            throw new Error(
                "JWT_MEMBER_SECRET is not defined in the environment variables.",
            );
        }

        return secret;
    }

    public static getJwtMemberRefreshSecret(): string {
        const secret = process.env.JWT_MEMBER_REFRESH_SECRET;
        if (!secret) {
            throw new Error(
                "JWT_MEMBER_REFRESH_SECRET is not defined in the environment variables.",
            );
        }
        return secret;
    }

    public static getAdminJwtSecret(): string {
        const secret = process.env.ADMIN_JWT_SECRET;

        if (!secret) {
            throw new Error(
                "ADMIN_JWT_SECRET is not defined in the environment variables.",
            );
        }
        return secret;
    }

    public static getAdminJwtRefreshSecret(): string {
        const secret = process.env.ADMIN_JWT_REFRESH_SECRET;
        if (!secret) {
            throw new Error(
                "ADMIN_JWT_REFRESH_SECRET is not defined in the environment variables.",
            );
        }
        return secret;
    }
}
