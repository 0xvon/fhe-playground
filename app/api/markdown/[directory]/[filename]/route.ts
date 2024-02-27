import { markdownContent } from "@/backend/markdown"
import { NextResponse } from "next/server";

type ResponseData = {
    htmlContent: string;
}

export async function GET(
    req: Request, context: { params: { directory: string; filename: string; } }
): Promise<NextResponse<ResponseData>> {
    const directory = context.params.directory as string;
    const filename = context.params.filename as string;
    const result = await markdownContent("spec/" + directory, filename);
    return NextResponse.json({ htmlContent: result }, { status: 200 })
}