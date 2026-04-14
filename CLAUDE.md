@AGENTS.md
@docs/infra.md

# 開發環境須知

## npm ci vs npm install

本機開發用 Node 24 / npm 11，但 CI (GitHub Actions) 和 Dockerfile 用 Node 22 / npm 10。
npm 11 產生的 package-lock.json 與 npm 10 的 `npm ci` 不相容（`npm ci` 會直接報 usage error 而非有意義的錯誤訊息）。

**規則：所有環境一律使用 `npm install`，不要用 `npm ci`。**

這包含：
- `.github/workflows/ci.yml`
- `Dockerfile`
- 任何未來新增的 workflow 或建置腳本

如果之後統一了所有環境的 Node/npm 版本，才可以考慮改回 `npm ci`。
