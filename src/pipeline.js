const STAGES = [
  { id: "push", name: "提交代码", desc: "git push 触发 GitHub Actions" },
  { id: "test", name: "自动测试", desc: "跑 node --test，失败则停止部署" },
  { id: "build", name: "自动编译", desc: "生成 dist/，写入版本与提交信息" },
  { id: "deploy", name: "自动部署", desc: "把产物发布到 GitHub Pages" },
];

function getStage(id) {
  return STAGES.find((stage) => stage.id === id) ?? null;
}

function formatBuildMeta({ version, sha, builtAt, ref }) {
  const shortSha = (sha || "local").slice(0, 7);
  return {
    version: version || "0.0.0",
    sha: shortSha,
    builtAt: builtAt || "local-dev",
    ref: ref || "local",
  };
}

function renderNotice(notice) {
  const text = String(notice ?? "").trim();
  if (!text) {
    throw new Error("发布公告不能为空");
  }
  return text;
}

module.exports = {
  STAGES,
  getStage,
  formatBuildMeta,
  renderNotice,
};
