const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  STAGES,
  getStage,
  formatBuildMeta,
  renderNotice,
} = require("../src/pipeline");
const release = require("../src/release");

describe("pipeline", () => {
  it("包含提交、测试、编译、部署四个阶段", () => {
    assert.deepEqual(
      STAGES.map((s) => s.id),
      ["push", "test", "build", "deploy"]
    );
  });

  it("能按 id 查找阶段", () => {
    assert.equal(getStage("build").name, "自动编译");
    assert.equal(getStage("missing"), null);
  });

  it("把提交 SHA 缩短为 7 位", () => {
    const meta = formatBuildMeta({
      version: "1.2.3",
      sha: "abcdef1234567890",
      builtAt: "2026-10-20T08:00:00.000Z",
      ref: "refs/heads/main",
    });
    assert.equal(meta.sha, "abcdef1");
    assert.equal(meta.version, "1.2.3");
  });

  it("拒绝空公告，避免部署空白页面", () => {
    assert.throws(() => renderNotice("   "), /不能为空/);
    assert.equal(renderNotice(release.notice), release.notice);
  });
});
