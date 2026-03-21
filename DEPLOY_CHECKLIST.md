# 招标助手 Pro - 部署检查清单

## Phase 1: 数据库部署 (Supabase)

### 1.1 创建 Supabase 项目
- [ ] 访问 https://supabase.com
- [ ] 点击 "New Project"
- [ ] 输入项目名称: bid-assistant-pro
- [ ] 选择区域: 建议选择 Asia (Singapore)
- [ ] 设置数据库密码（保存好！）
- [ ] 等待项目创建完成（约 2 分钟）

### 1.2 初始化数据库
- [ ] 进入项目 Dashboard
- [ ] 点击左侧 "SQL Editor"
- [ ] 新建查询
- [ ] 复制 `backend/scripts/init-db.sql` 全部内容
- [ ] 点击 "Run" 执行
- [ ] 确认所有表创建成功

### 1.3 获取连接信息
- [ ] 点击左侧 "Settings" → "Database"
- [ ] 找到 "Connection string" (URI 格式)
- [ ] 记录以下信息：
  ```
  Host: db.xxxxx.supabase.co
  Port: 5432
  Database: postgres
  User: postgres
  Password: [你的密码]
  ```

---

## Phase 2: Vercel 部署

### 2.1 准备代码
- [ ] 确保所有代码已提交到 GitHub
- [ ] 确认 `vercel.json` 配置正确
- [ ] 确认 `package.json` 依赖完整

### 2.2 Vercel 项目设置
- [ ] 访问 https://vercel.com
- [ ] 点击 "Add New Project"
- [ ] 导入 GitHub 仓库: rundong777-pixel/bid-assistant-pro
- [ ] 框架预设: Other
- [ ] 根目录: ./
- [ ] 构建命令: （留空）
- [ ] 输出目录: （留空）

### 2.3 配置环境变量
- [ ] 进入项目 Settings → Environment Variables
- [ ] 添加以下变量：
  ```
  DB_HOST=db.xxxxx.supabase.co
  DB_PORT=5432
  DB_NAME=postgres
  DB_USER=postgres
  DB_PASSWORD=[你的密码]
  DB_SSL=true
  ```
- [ ] 点击 "Save"

### 2.4 部署
- [ ] 点击 "Deploy"
- [ ] 等待构建完成（约 1-2 分钟）
- [ ] 记录分配的域名: https://bid-assistant-pro-xxxxx.vercel.app

### 2.5 验证部署
- [ ] 访问 `https://[你的域名]/api/health`
- [ ] 应该返回: `{"status":"ok",...}`
- [ ] 访问 `https://[你的域名]/`
- [ ] 应该显示 Landing Page

---

## Phase 3: GitHub Actions 配置

### 3.1 添加 Secrets
- [ ] 进入 GitHub 仓库
- [ ] Settings → Secrets and variables → Actions
- [ ] 点击 "New repository secret"
- [ ] 添加以下 secrets：
  ```
  DB_HOST
  DB_PORT
  DB_NAME
  DB_USER
  DB_PASSWORD
  ```

### 3.2 测试自动抓取
- [ ] 进入 Actions 标签页
- [ ] 选择 "招标数据抓取"
- [ ] 点击 "Run workflow"
- [ ] 等待执行完成
- [ ] 检查 Supabase 数据库是否有数据

---

## Phase 4: iOS App 发布

### 4.1 准备工作
- [ ] 注册 Apple Developer 账号（¥688/年）
- [ ] 等待账号审核通过
- [ ] 安装 Xcode 15+

### 4.2 项目配置
- [ ] 打开 `ios/BidAssistantPro.xcodeproj`
- [ ] 选择 Target → Signing & Capabilities
- [ ] 设置 Bundle Identifier: `com.yourcompany.bidassistantpro`
- [ ] 选择 Team: 你的开发者账号
- [ ] 更新 `BidStore.swift` 中的 API 地址

### 4.3 构建和上传
- [ ] 选择 Any iOS Device (arm64)
- [ ] Product → Archive
- [ ] Window → Organizer
- [ ] 选择 Archive → Distribute App
- [ ] 选择 App Store Connect → Upload
- [ ] 等待上传完成

### 4.4 App Store Connect 配置
- [ ] 访问 https://appstoreconnect.apple.com
- [ ] 点击 "+" 创建新 App
- [ ] 填写 App 信息（参考 APP_STORE_GUIDE.md）
- [ ] 上传截图（各种尺寸）
- [ ] 设置定价和应用内购买
- [ ] 填写隐私政策链接
- [ ] 提交审核

---

## Phase 5: 验证和监控

### 5.1 功能验证
- [ ] iOS App 能正常打开
- [ ] 能显示招标列表
- [ ] 能查看招标详情
- [ ] 推送通知正常工作
- [ ] 订阅功能正常

### 5.2 监控设置
- [ ] Vercel Dashboard: 监控 API 调用
- [ ] Supabase Dashboard: 监控数据库
- [ ] App Store Connect: 监控下载和收入
- [ ] GitHub Actions: 监控定时任务

---

## 紧急联系

如有问题：
- GitHub Issues: https://github.com/rundong777-pixel/bid-assistant-pro/issues
- Email: support@bid-assistant-pro.com

---

**预计总时间**: 2-3 天
**总成本**: ¥688/年 (仅 Apple Developer 账号)
