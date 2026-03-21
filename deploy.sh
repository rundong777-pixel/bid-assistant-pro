#!/bin/bash
# 招标助手 Pro - 一键部署脚本

echo "🚀 招标助手 Pro 部署脚本"
echo "=========================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js 未安装${NC}"
    echo "请先安装 Node.js 18+: https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js 版本: $(node --version)${NC}"

# 检查 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️ Vercel CLI 未安装，正在安装...${NC}"
    npm install -g vercel
fi

echo -e "${GREEN}✅ Vercel CLI 已安装${NC}"

# 安装依赖
echo ""
echo "📦 安装依赖..."
npm install

# 部署到 Vercel
echo ""
echo "🚀 部署到 Vercel..."
vercel --prod

echo ""
echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo "⚠️ 重要：请在 Vercel Dashboard 中配置以下环境变量："
echo "  - DB_HOST"
echo "  - DB_PORT (默认: 5432)"
echo "  - DB_NAME"
echo "  - DB_USER"
echo "  - DB_PASSWORD"
echo "  - DB_SSL (设置为 true)"
echo ""
echo "📖 详细说明请参考 DEPLOY.md"
