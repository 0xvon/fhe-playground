"use server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import html from "remark-html";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export const markdownContent = async (
    directoryPath: string, // spec/bfv
    fileName: string // secretkey
): Promise<string> => {
    const directory = path.join(process.cwd(), directoryPath);

    const fullPath = path.join(directory, `${fileName}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    const processedContent = await remark()
        .use(remarkParse)
        .use(remarkGfm)
        .use(html, { sanitize: false })
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return contentHtml;
};