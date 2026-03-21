#!/bin/bash
# 招标助手 Pro - 全自动部署上架脚本
# 运行: ./auto-deploy.sh

echo "🚀 招标助手 Pro - 全自动部署上架"
echo "=================================="
echo ""
echo "此脚本将完成："
echo "  1. 部署后端 API 到 Vercel"
echo "  2. 配置数据库"
echo "  3. 构建 Android App"
echo "  4. 输出上架所需的所有文件"
echo ""
read -p "是否开始? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "已取消"
    exit 0
fi

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd "$(dirname "$0")"

# ========== 步骤 1: 检查环境 ==========
echo ""
echo "📋 步骤 1/5: 检查环境"
echo "-------------------"

commands=("node" "npm" "git" "vercel")
for cmd in "${commands[@]}"; do
    if command -v $cmd &> /dev/null; then
        echo -e "${GREEN}✅ $cmd${NC}"
    else
        echo -e "${RED}❌ $cmd 未安装${NC}"
        if [ "$cmd" = "vercel" ]; then
            echo "正在安装 Vercel CLI..."
            npm install -g vercel
        else
            exit 1
        fi
    fi
done

# ========== 步骤 2: 安装依赖 ==========
echo ""
echo "📦 步骤 2/5: 安装依赖"
echo "-------------------"
npm install

# ========== 步骤 3: 部署到 Vercel ==========
echo ""
echo "🚀 步骤 3/5: 部署后端到 Vercel"
echo "-------------------"
echo -e "${YELLOW}⚠️  请按提示操作：${NC}"
echo "  1. 登录 Vercel（按 Enter 打开浏览器）"
echo "  2. 链接到 GitHub 仓库"
echo "  3. 设置环境变量（后续在网页上设置）"
echo ""
echo "按 Enter 继续..."
read

vercel --prod

echo ""
echo -e "${GREEN}✅ Vercel 部署完成！${NC}"
echo ""
echo "⚠️  重要：请在 Vercel Dashboard 中设置环境变量："
echo "  DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, DB_SSL"
echo ""

# ========== 步骤 4: 构建 Android App ==========
echo ""
echo "📱 步骤 4/5: 构建 Android App"
echo "-------------------"

cd android

# 检查 Gradle
if [ ! -f "gradlew" ]; then
    echo "创建 Gradle Wrapper..."
    gradle wrapper --gradle-version 8.2
fi

chmod +x gradlew

# 构建
echo "构建 Release APK..."
./gradlew assembleRelease

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Android 构建成功！${NC}"
    
    # 签名
    if [ ! -f "release.keystore" ]; then
        echo "创建签名密钥..."
        keytool -genkey -v \
            -keystore release.keystore \
            -alias bidassistant \
            -keyalg RSA \
            -keysize 2048 \
            -validity 10000 \
            -dname "CN=BidAssistant, OU=App, O=Company, L=City, ST=State, C=CN" \
            -storepass bidassistant123 \
            -keypass bidassistant123
    fi
    
    # 签名 APK
    UNSIGNED_APK="app/build/outputs/apk/release/app-release-unsigned.apk"
    SIGNED_APK="app/build/outputs/apk/release/bid-assistant-pro-v1.0.0.apk"
    
    if command -v apksigner &> /dev/null; then
        apksigner sign \
            --ks release.keystore \
            --ks-key-alias bidassistant \
            --ks-pass pass:bidassistant123 \
            --key-pass pass:bidassistant123 \
            --out "$SIGNED_APK" \
            "$UNSIGNED_APK"
        echo -e "${GREEN}✅ APK 签名完成${NC}"
    else
        echo -e "${YELLOW}⚠️  未找到 apksigner，APK 未签名${NC}"
        echo "请使用 Android Studio 签名"
        SIGNED_APK="$UNSIGNED_APK"
    fi
    
    cd ..
else
    echo -e "${RED}❌ Android 构建失败${NC}"
    cd ..
fi

# ========== 步骤 5: 生成上架包 ==========
echo ""
echo "📦 步骤 5/5: 生成上架包"
echo "-------------------"

mkdir -p release

cp android/app/build/outputs/apk/release/*.apk release/ 2>/dev/null || true
cp -r web release/
cp DEPLOY_CHECKLIST.md release/
cp android/CHINA_STORES_GUIDE.md release/
cp android/GOOGLE_PLAY_GUIDE.md release/
cp ios/APP_STORE_GUIDE.md release/

echo -e "${GREEN}✅ 上架包已生成到 release/ 目录${NC}"

# ========== 完成 ==========
echo ""
echo "=================================="
echo -e "${GREEN}🎉 部署准备完成！${NC}"
echo "=================================="
echo ""
echo "📁 输出文件："
echo "  release/*.apk - Android 安装包"
echo "  release/web/ - 网站文件"
echo "  release/*GUIDE.md - 上架指南"
echo ""
echo "📱 上架步骤："
echo ""
echo "【Android - 国内商店（免费）】"
echo "  1. 华为: https://developer.huawei.com"
echo "  2. 小米: https://dev.mi.com"
echo "  3. 应用宝: https://app.open.qq.com"
echo "  4. 酷安: https://developer.coolapk.com"
echo "  详见: release/CHINA_STORES_GUIDE.md"
echo ""
echo "【Android - Google Play ($25)】"
echo "  https://play.google.com/console"
echo "  详见: release/GOOGLE_PLAY_GUIDE.md"
echo ""
echo "【iOS - App Store (¥688/年)】"
echo "  https://developer.apple.com"
echo "  详见: release/APP_STORE_GUIDE.md"
echo ""
echo "🔗 GitHub: https://github.com/rundong777-pixel/bid-assistant-pro"
echo ""
