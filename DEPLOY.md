# 招标助手 Pro - 部署指南

## 1. 数据库部署（Supabase）

### 创建项目
1. 访问 https://supabase.com
2. 创建新项目
3. 记录以下信息：
   - Project URL
   - Database password
   - Connection string

### 初始化数据库
1. 进入 SQL Editor
2. 复制 `backend/scripts/init-db.sql` 内容
3. 执行 SQL 脚本

### 获取连接信息
- Host: `[project-ref].supabase.co`
- Port: `5432`
- Database: `postgres`
- User: `postgres`
- Password: 你设置的密码

## 2. Vercel 部署

### 安装 Vercel CLI
```bash
npm i -g vercel
```

### 登录并部署
```bash
cd bid-assistant-pro
vercel login
vercel
```

### 配置环境变量
在 Vercel Dashboard 中添加以下环境变量：
- `DB_HOST`: 数据库主机
- `DB_PORT`: 5432
- `DB_NAME`: postgres
- `DB_USER`: postgres
- `DB_PASSWORD`: 数据库密码
- `DB_SSL`: true

## 3. GitHub Actions 配置

### 添加 Secrets
在 GitHub 仓库 Settings -> Secrets and variables -> Actions 中添加：
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

### 手动触发抓取
进入 Actions 标签页，选择 "招标数据抓取"，点击 "Run workflow"

## 4. iOS App 配置

### 更新 API 地址
在 `BidStore.swift` 中修改：
```swift
private let baseURL = "https://your-domain.vercel.app/api"
```

### 打包发布
1. 使用 Xcode 打开 `ios/BidAssistantPro`
2. 配置签名和证书
3. Archive 并上传到 App Store Connect

## 5. 验证部署

### 测试 API
```bash
# 健康检查
curl https://your-domain.vercel.app/api/health

# 获取招标列表
curl https://your-domain.vercel.app/api/bids

# 带筛选的查询
curl "https://your-domain.vercel.app/api/bids?source=leapmotor&keyword=新能源"
```

### 运行抓取脚本
```bash
npm run fetch
```

## 6. 监控和维护

- Vercel Dashboard: 查看 API 调用和日志
- Supabase Dashboard: 监控数据库
- GitHub Actions: 查看定时任务执行情况

## 成本估算

| 服务 | 免费额度 | 预估月费用 |
|------|---------|-----------|
| Vercel | 100GB 带宽 | ¥0 |
| Supabase | 500MB 数据库 | ¥0 |
| GitHub Actions | 2000 分钟 | ¥0 |
| iOS 开发者账号 | - | ¥688/年 |

**总计：¥688/年（仅 iOS 开发者账号）**
