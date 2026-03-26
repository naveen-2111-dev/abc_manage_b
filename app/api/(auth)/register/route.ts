import { NextRequest, NextResponse } from "next/server";
import { RegisterService } from "./register.service";

export async function POST(request: NextRequest) {
    const { name, email, password } = await request.json();

    try {
        const registerService = new RegisterService();
        const res = await registerService.register(name, email, password);
        return NextResponse.json({ message: "User registered successfully", user: res });
    } catch (error) {
        return NextResponse.json(
            { error: `Registration failed: ${error instanceof Error ? error.message : "Unknown error"}` },
            { status: 400 }
        );
    }
}