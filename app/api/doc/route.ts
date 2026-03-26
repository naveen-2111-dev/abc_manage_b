import { NextResponse } from "next/server";
import path from "node:path";
import SwaggerParser from "@apidevtools/swagger-parser";

export const runtime = "nodejs";

export async function GET() {
    try {
        const filePath = path.resolve("./lib/swagger.yaml");
        const doc = await SwaggerParser.validate(filePath);

        return NextResponse.json(doc);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}