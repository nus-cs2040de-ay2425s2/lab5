// scripts/fetch-notion.js
const fs = require("fs");
const path = require("path");
const { Client } = require("@notionhq/client");
const { NotionToMarkdown } = require("notion-to-md");
const { marked } = require("marked");

const notionToken = process.env.NOTION_TOKEN;
const notionPageId = "19d6196e90d4804c998fff35895e2463";

async function main() {
  // 1) Initialize Notion client
  const notion = new Client({ auth: notionToken });
  
  // 2) Initialize NotionToMarkdown
  const n2m = new NotionToMarkdown({ notionClient: notion });

  // 3) Get page metadata
  const page = await notion.pages.retrieve({ page_id: notionPageId });
  
  // 4) Convert to markdown
  const mdBlocks = await n2m.pageToMarkdown(notionPageId);
  const { parent: markdownString } = n2m.toMarkdownString(mdBlocks);
  
  // 5) Convert markdown to HTML
  const html = marked.parse(markdownString || '');

  // 6) Create a full HTML document with styling
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CS2040DE Lab 5</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
        }
        h1, h2, h3 { color: #2c3e50; }
        code {
            background: #f5f5f5;
            padding: 2px 5px;
            border-radius: 3px;
        }
        pre {
            background: #f5f5f5;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
        img { max-width: 100%; height: auto; }
        a { color: #3498db; }
        blockquote {
            margin: 0;
            padding-left: 1em;
            border-left: 4px solid #e5e5e5;
            color: #666;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    </style>
</head>
<body>
    ${html}
</body>
</html>`;

  // 7) Write the HTML to a local file
  const outputDir = path.join(__dirname, "..", "public");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const outPath = path.join(outputDir, "index.html");
  fs.writeFileSync(outPath, fullHtml);

  console.log(`Successfully wrote HTML to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
