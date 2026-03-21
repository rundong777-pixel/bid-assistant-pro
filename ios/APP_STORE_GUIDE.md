# iOS App Store 发布指南

## 1. 准备工作

### 必需条件
- [x] Apple Developer 账号（¥688/年）
- [x] Xcode 15+
- [x] 有效的 Bundle Identifier
- [x] App 图标和截图

### 注册开发者账号
1. 访问 https://developer.apple.com
2. 使用 Apple ID 登录
3. 加入 Apple Developer Program
4. 支付年费 ¥688
5. 等待审核（通常 1-3 天）

## 2. App 配置

### 更新 Bundle ID
在 `ios/BidAssistantPro.xcodeproj` 中：
- Bundle Identifier: `com.yourcompany.bidassistantpro`
- Team: 选择你的开发者账号

### 配置 API 地址
在 `BidStore.swift` 中：
```swift
private let baseURL = "https://bid-assistant-pro.vercel.app/api"
```

### App 图标
准备以下尺寸的图标：
- 1024x1024 (App Store)
- 180x180 (iPhone)
- 167x167 (iPad)
- 152x152 (iPad)
- 120x120 (iPhone)

### App 截图
准备 iPhone 和 iPad 截图：
- iPhone 6.7" (1290x2796)
- iPhone 6.5" (1284x2778)
- iPhone 5.5" (1242x2208)
- iPad Pro (2048x2732)

## 3. 构建和上传

### Xcode 构建
1. 打开 `ios/BidAssistantPro.xcodeproj`
2. 选择 Target: BidAssistantPro
3. 选择 Any iOS Device (arm64)
4. Product → Archive
5. 等待构建完成

### 上传到 App Store
1. Window → Organizer
2. 选择最新的 Archive
3. 点击 "Distribute App"
4. 选择 "App Store Connect"
5. 选择 "Upload"
6. 等待上传完成（约 10-30 分钟）

## 4. App Store Connect 配置

### 创建 App 记录
1. 访问 https://appstoreconnect.apple.com
2. 点击 "+" 创建新 App
3. 填写信息：
   - 平台：iOS
   - 名称：招标助手 Pro
   - 主要语言：简体中文
   - Bundle ID: com.yourcompany.bidassistantpro
   - SKU: bid-assistant-pro-001

### 填写 App 信息

**App 名称**：招标助手 Pro

**副标题**：专业招标信息监控与分析工具

**类别**：商务 / 效率

**描述**：
```
招标助手 Pro 是一款专业的招标信息监控与分析工具，帮助您实时获取招标信息、智能筛选匹配项目。

核心功能：
• 实时监控：覆盖一汽、东风、零跑等主流招标平台
• 智能筛选：根据关键词、地区、类型精准匹配
• 投标分析：AI 智能分析中标概率
• 及时推送：重要招标信息第一时间推送
• 收藏管理：关注感兴趣的招标项目

适用人群：
• 汽车行业供应商
• 招投标从业人员
• 商务拓展人员
• 企业采购人员

订阅说明：
• 免费版：每日限 10 条推送
• 专业版：¥68/月 或 ¥298/年，无限推送 + AI 分析

隐私政策：https://your-domain.com/privacy
服务条款：https://your-domain.com/terms
```

**关键词**：招标,投标,采购,一汽,东风,零跑,汽车,供应商,商务

**支持 URL**: https://github.com/rundong777-pixel/bid-assistant-pro

**营销 URL**: （可选）

### 设置定价
- 免费下载
- 应用内购买：专业版订阅

### 添加应用内购买
1. 选择 "功能" → "应用内购买"
2. 创建两个订阅：
   - 月度订阅：¥68
   - 年度订阅：¥298

### 提交审核
1. 选择 "App 审核" 标签
2. 点击 "提交以供审核"
3. 填写审核信息：
   - 联系信息
   - 演示账号（如有）
   - 备注说明

## 5. 审核和发布

### 审核时间
- 首次提交：3-7 天
- 更新版本：1-2 天

### 常见被拒原因
- [ ] 功能不完整
- [ ] 崩溃或严重 Bug
- [ ] 描述不准确
- [ ] 缺少隐私政策
- [ ] 截图与实际不符

### 发布后
- 监控用户反馈
- 收集崩溃报告
- 定期更新版本

## 6. 快速检查清单

提交前确认：
- [ ] App 在真机上测试通过
- [ ] 所有功能正常工作
- [ ] 网络请求使用 HTTPS
- [ ] 隐私政策链接有效
- [ ] 截图清晰、无误导
- [ ] 描述准确、无夸大
- [ ] 无崩溃或明显 Bug

## 7. 联系方式

审核期间 Apple 可能联系你，确保：
- 开发者账号邮箱可接收邮件
- 电话可接通
- 及时回复 Apple 的询问

---

**预计时间**：从准备到上架约 1-2 周
**总成本**：¥688/年（开发者账号）
