const fs = require("fs");
const path = require("path");
const mammoth = require("mammoth");
const cheerio = require("cheerio");

const inputPath = path.join(__dirname, "input", "file.docx");
const outputHtmlPath = path.join(__dirname, "output", "result.html");
const stylePath = path.join(__dirname, "public", "style.css");


mammoth.convertToHtml({ path: inputPath })
.then((result) => {
  let html = result.value;
  const $ = cheerio.load(html);

  $("p").each((_, el) => {
    const $el = $(el);
    const text = $el.text().trim();

    const classMatch = text.match(/\[class=([^\]]+)\]/);
    if (classMatch) {
      $el.addClass(classMatch[1]);
      $el.text(text.replace(/\[class=([^\]]+)\]/, "").trim());
    }


    if (/20___ yil/.test(text)) {
      const newDiv = `<pre class="date_row">${$el.html()}</pre>`;
      $el.replaceWith(newDiv);
    }
  });

  const finalHtml = `
<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <title>Shartnoma</title>
  <link rel="stylesheet" href="./../public/style.css">
</head>
<body>
${$("body").html()}
</body>
</html>`;

  fs.writeFileSync(outputHtmlPath, finalHtml.trim(), "utf8");
  console.log(" HTML tayyor bo‘ldi.");
})

  .catch((err) => {
    console.error("Xatolik:", err);
  });


if (!fs.existsSync(stylePath)) {
  fs.mkdirSync(path.dirname(stylePath), { recursive: true });
  fs.writeFileSync(stylePath, `
body {
  font-family: "Arial", sans-serif;
  font-size: 16px;
  padding: 20px;
  line-height: 1.6;
}
.text_center {
  text-align: center;
  font-weight: bold;
}
.small_font {
  font-size: 13px;
  font-style: italic;
}
.gap_space {
  white-space: pre-wrap;
}
.text_indent {
  display: block;
  text-indent: 24px;
}
.date_margin {
  display: inline-block;
  margin-left: 30px;
}
`, "utf8");
}
