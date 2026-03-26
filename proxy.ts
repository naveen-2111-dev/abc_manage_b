import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { EnvConfig } from "./config/env_config";

type DecodedToken = {
    role?: "admin" | "member";
    sub?: string;
};

function verifyAccessToken(token: string): DecodedToken {
    try {
        return jwt.verify(token, EnvConfig.getAdminJwtSecret()) as DecodedToken;
    } catch {
        return jwt.verify(token, EnvConfig.getJwtMemberSecret()) as DecodedToken;
    }
}

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decoded: DecodedToken;

    try {
        decoded = verifyAccessToken(token);
    } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const role = decoded.role;

    if (!role) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (pathname.startsWith("/api/admin") && role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (pathname.startsWith("/api/member") && role !== "member") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/admin/:path*", "/api/member/:path*"],
};