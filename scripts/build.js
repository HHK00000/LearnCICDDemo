const fs = require("node:fs");
const path = require("node:path");
const { STAGES, formatBuildMeta, renderNotice } = require("../src/pipeline");
const release = require("../src/release");
const pkg = require("../package.json");

const root = path.join(__dirname, "..");
const dist = path.join(root, "dist");

const meta = formatBuildMeta({
  version: pkg.version,
  sha: process.env.GITHUB_SHA || "local",
  builtAt: new Date().toISOString(),
  ref: process.env.GITHUB_REF || "local",
});

const notice = renderNotice(release.notice);

function stageHtml(stage, index) {
  return `
    <li class="stage">
      <span class="index">${String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>${stage.name}</h3>
        <p>${stage.desc}</p>
      </div>
    </li>
  `;
}

const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${release.title}</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <main>
      <p class="eyebrow">GitHub Actions 教程 Demo</p>
      <h1>${release.headline}</h1>
      <p class="lede">
        本页由流水线在编译阶段生成。改 <code>src/release.js</code> 后 push 到
        <code>main</code>，大约一两分钟就能在 GitHub Pages 看到新内容。
      </p>

      <section class="notice">
        <h2>本次发布公告</h2>
        <p>${notice}</p>
        <p class="by">发布人：${release.author}</p>
      </section>

      <section>
        <h2>流水线在做什么</h2>
        <ol class="stages">
          ${STAGES.map(stageHtml).join("")}
        </ol>
      </section>

      <dl class="meta">
        <div><dt>版本</dt><dd>${meta.version}</dd></div>
        <div><dt>提交</dt><dd><code>${meta.sha}</code></dd></div>
        <div><dt>分支</dt><dd><code>${meta.ref}</code></dd></div>
        <div><dt>编译时间</dt><dd>${meta.builtAt}</dd></div>
      </dl>
    </main>
  </body>
</html>
`;

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, "index.html"), html);
fs.copyFileSync(path.join(root, "src", "styles.css"), path.join(dist, "styles.css"));

console.log("build ok -> dist/");
console.log(JSON.stringify(meta, null, 2));
