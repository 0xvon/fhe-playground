import { markdownContent } from "@/backend/markdown"
import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
    htmlContent: string;
}

export default async function GET(
    req: NextApiRequest, res: NextApiResponse<ResponseData>
) {
    const { infoFileDirectory, infoFilePath } = req.query;
    console.log("infoFileDirectory", infoFileDirectory);
    console.log("infoFilePath", infoFilePath);
    if (infoFileDirectory && infoFilePath) {
        console.log("infoFileDirectory", infoFileDirectory);
        console.log("infoFilePath", infoFilePath);
        const result = await markdownContent("spec/" + (infoFileDirectory as string), infoFilePath as string);
        res.status(200).json({ htmlContent: result });
    }
}