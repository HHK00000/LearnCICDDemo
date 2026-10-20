# CI/CD 学习 Demo

这是一个最小可跑通的 GitHub Actions 教程：你把代码 push 到 `main`，流水线会 **测试 → 编译 → 部署到 GitHub Pages**。部署完成后，页面上会显示本次提交的短 SHA 和编译时间。

```text
本地改代码  →  git push  →  GitHub Actions
                              ├─ npm test     失败则停止
                              ├─ npm run build 生成 dist/
                              └─ 发布 GitHub Pages
```

## 仓库里有什么

| 路径 | 作用 |
| --- | --- |
| `src/release.js` | 页面文案。**改这里再 push，最容易看到部署效果。** |
| `src/pipeline.js` | 流水线阶段定义和编译元数据 |
| `test/pipeline.test.js` | 自动测试。测试失败时不会部署 |
| `scripts/build.js` | 编译：把模板写成 `dist/index.html` |
| `.github/workflows/cicd.yml` | GitHub 流水线定义 |

## 本地先跑一遍

需要 Node.js 20+。

```bash
npm test
npm run build
npm start
```

浏览器打开 http://localhost:4173 ，应能看到看板。本地编译时提交号会显示为 `local`；真正由 GitHub Actions 编译时才会写入真实 SHA。

## 接到 GitHub 并打开自动部署

1. 在 GitHub 新建一个**空仓库**（不要勾选自动加 README）。
2. 在本目录执行：

```bash
git init
git add .
git commit -m "feat: 初始化 CI/CD 学习 demo"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

3. 打开仓库 **Settings → Pages → Build and deployment → Source**，选 **GitHub Actions**。
4. 打开仓库 **Actions** 标签页，应能看到名为 `CI/CD` 的工作流正在跑。
5. 全部变绿后，Pages 地址一般是：

```text
https://<你的用户名>.github.io/<仓库名>/
```

如果仓库名就是 `<用户名>.github.io`，则站点在根路径。

## 验证「提交就会部署」

1. 编辑 `src/release.js` 里的 `notice`。
2. 提交并推送：

```bash
git add src/release.js
git commit -m "chore: 更新发布公告"
git push
```

3. 到 Actions 看这次运行：应先出现「测试并编译」，再出现「部署到 GitHub Pages」。
4. 刷新 Pages 站点，公告、提交号、编译时间都会更新。

## 流水线怎么读

工作流文件：`.github/workflows/cicd.yml`

- `on.push` / `on.pull_request`：往 `main` 提交或开 PR 就会跑。
- `workflow_dispatch`：也可以在 Actions 页面手动点「Run workflow」。
- Job `测试并编译`：`npm test` → `npm run build` → 上传 `dist/` 产物。
- Job `部署到 GitHub Pages`：只在 push（以及手动触发）时执行，**PR 只测试不部署**，避免把未合并改动发到线上。
- `permissions.pages` 和 `id-token`：部署 Pages 所必需。

## 常见问题

**Actions 是绿的，但打不开网站**  
多半还没把 Pages Source 改成 GitHub Actions。改完再手动跑一次工作流。

**部署 Job 被跳过**  
当前这次是 Pull Request。合并进 `main` 后才会部署。

**测试失败导致没有部署**  
这是故意的：CI 保护 CD。先看 Actions 日志里 `npm test` 的报错，修完再 push。

**想用自己的域名**  
在 Pages 设置里填 Custom domain。流水线不用改。
