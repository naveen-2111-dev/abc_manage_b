import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { EnvConfig } from "@/config/env_config";

interface DecodedToken {
    role?: "member" | "admin";
    sub?: string;
    iat?: number;
    exp?: number;
}

async function verifyToken(token: string, secret: string): Promise<DecodedToken> {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded as DecodedToken);
            }
        });
    });
}

export async function POST() {
    const cookieStore = await cookies();

    const r_token = cookieStore.get("refreshToken")?.value;

    if (!r_token) {
        return new Response(JSON.stringify({ error: "No refresh token provided" }), { status: 400 });
    }

    let decoded: DecodedToken;

    try {
        try {
            decoded = await verifyToken(r_token, EnvConfig.getAdminJwtRefreshSecret());
        } catch {
            decoded = await verifyToken(r_token, EnvConfig.getJwtMemberRefreshSecret());
        }
    } catch {
        return new Response(JSON.stringify({ error: "Invalid refresh token" }), { status: 401 });
    }

    let newAccessToken: string;

    if (decoded.role === "admin") {
        newAccessToken = jwt.sign(
            { sub: decoded.sub, role: decoded.role },
            EnvConfig.getAdminJwtSecret(),
            { expiresIn: "1h" }
        );
    } else {
        newAccessToken = jwt.sign(
            { sub: decoded.sub, role: decoded.role },
            EnvConfig.getJwtMemberSecret(),
            { expiresIn: "1h" }
        );
    }

    cookieStore.set("token", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: 60 * 60,
        path: "/",
    });

    return NextResponse.json({
        message: "Access token refreshed",
    });
}
