#!/bin/bash
# 招标助手 Pro - 快速启动部署
# 运行: ./quick-start.sh

echo "🚀 招标助手 Pro - 快速启动"
echo "=========================="
echo ""

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 检查命令
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "📋 步骤 1/5: 检查环境"
echo "-------------------"

# Node.js
if command_exists node; then
    echo -e "${GREEN}✅ Node.js: $(node --version)${NC}"
else
    echo -e "${RED}❌ Node.js 未安装${NC}"
    echo "请访问 https://nodejs.org 安装 Node.js 18+"
    exit 1
fi

# Git
if command_exists git; then
    echo -e "${GREEN}✅ Git: $(git --version | head -1)${NC}"
else
    echo -e "${RED}❌ Git 未安装${NC}"
    exit 1
fi

# Vercel CLI
if command_exists vercel; then
    echo -e "${GREEN}✅ Vercel CLI 已安装${NC}"
else
    echo -e "${YELLOW}⚠️ 正在安装 Vercel CLI...${NC}"
    npm install -g vercel
fi

echo ""
echo "📦 步骤 2/5: 安装依赖"
echo "-------------------"
npm install

echo ""
echo "🔧 步骤 3/5: 准备部署"
echo "-------------------"
echo -e "${YELLOW}⚠️ 请确保已完成以下准备：${NC}"
echo ""
echo "1. Supabase 数据库："
echo "   - 访问 https://supabase.com 创建项目"
echo "   - 执行 backend/scripts/init-db.sql"
echo "   - 记录数据库连接信息"
echo ""
echo "2. Vercel 账号："
echo "   - 访问 https://vercel.com 注册/登录"
echo "   - 连接 GitHub 账号"
echo ""
read -p "是否继续部署? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消部署"
    exit 0
fi

echo ""
echo "🚀 步骤 4/5: 部署到 Vercel"
echo "-------------------"
echo "按照 Vercel CLI 提示操作..."
echo ""
vercel

echo ""
echo "📱 步骤 5/5: iOS App 发布"
echo "-------------------"
echo -e "${YELLOW}iOS App 发布需要以下步骤：${NC}"
echo ""
echo "1. 注册 Apple Developer 账号 (¥688/年)"
echo "   https://developer.apple.com"
echo ""
echo "2. 打开 Xcode 项目"
echo "   open ios/BidAssistantPro.xcodeproj"
echo ""
echo "3. 配置签名和 Bundle ID"
echo ""
echo "4. 更新 API 地址为 Vercel 部署地址"
echo ""
echo "5. Product → Archive → Upload to App Store"
echo ""
echo "详细说明请参考："
echo "  - ios/APP_STORE_GUIDE.md"
echo "  - DEPLOY_CHECKLIST.md"
echo ""

echo "✅ 快速启动完成！"
echo ""
echo "📚 有用链接："
echo "  GitHub: https://github.com/rundong777-pixel/bid-assistant-pro"
echo "  部署清单: DEPLOY_CHECKLIST.md"
echo "  App Store 指南: ios/APP_STORE_GUIDE.md"
echo ""
