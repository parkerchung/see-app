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

## 部署注意事項

### bms-prod-02 有 $COMPOSE_FILE 環境變數
VM 上 TBMS 設了 `$COMPOSE_FILE`，會劫持所有 `docker compose` 指令。
**規則：操作 see-app 容器時一律使用 `-f /opt/see-app/docker-compose.yml`。**

### Docker standalone 模式沒有 node_modules/.bin/
Next.js standalone output 只保留最小檔案，`npx` 無法運作。
**規則：在 docker-entrypoint.sh 中用 `node ./node_modules/prisma/build/index.js` 呼叫 prisma CLI，不要用 `npx`。**

### workflow_run 的 checkout 行為
`workflow_run` 觸發的 workflow，`actions/checkout@v4` 預設 checkout **repo 的預設分支**（master），不是觸發 CI 的分支。
**規則：deploy workflow 的 checkout 步驟必須明確指定 `ref: main`。**

## 修改守則

修改任何設定時，必須全域搜尋所有相關位置一次改完：
- 改 `npm ci` → grep 所有 `npm ci`（CI workflow、Dockerfile、其他 script）
- 改環境變數 → 確認 workflow、compose、entrypoint 都一致
- 改分支策略 → 確認所有 workflow 的 trigger 和 checkout ref
