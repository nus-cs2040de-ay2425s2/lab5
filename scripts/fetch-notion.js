// scripts/fetch-notion.js
const fs = require("fs");
const path = require("path");
const { Client } = require("@notionhq/client");
const { NotionToHtml } = require("@jax-pancake/notion-to-html");

const notionToken = process.env.NOTION_TOKEN;
const notionPageId = "19d6196e90d4804c998fff35895e2463";

async function main() {
  // 1) Initialize Notion client
  const notion = new Client({ auth: notionToken });

  // 2) Convert Notion page to HTML
  const n2h = new NotionToHtml({ notionClient: notion });
  const { title, html } = await n2h.pageToHtml(notionPageId);

  // 3) Write the HTML to a local file
  // In this example, we'll store it in "public/index.html"
  const outputDir = path.join(__dirname, "..", "public");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const outPath = path.join(outputDir, "index.html");
  fs.writeFileSync(outPath, html);

  console.log(`Successfully wrote HTML to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
