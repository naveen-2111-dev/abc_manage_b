import { NextRequest, NextResponse } from "next/server";
import { LoginService } from "./login.service";

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();

    try {
        const service = new LoginService();
        const result = await service.login({
            email,
            password,
        })

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: `Authentication failed: ${error instanceof Error ? error.message : "Unknown error"}` }, { status: 401 });
    }
}