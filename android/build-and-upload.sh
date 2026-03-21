#!/bin/bash
# Android App 构建和上架脚本

echo "🚀 招标助手 Pro - Android 构建上架"
echo "=================================="

# 颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

cd "$(dirname "$0")"

# 检查 Java
echo ""
echo "📋 检查环境..."
if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ Java 未安装${NC}"
    echo "请安装 JDK 17: https://adoptium.net"
    exit 1
fi

# 检查 Android SDK
if [ -z "$ANDROID_HOME" ]; then
    echo -e "${YELLOW}⚠️ ANDROID_HOME 未设置${NC}"
    echo "请安装 Android Studio 并设置 SDK"
    exit 1
fi

echo -e "${GREEN}✅ 环境检查通过${NC}"

# 构建 Release APK
echo ""
echo "🔨 构建 Release APK..."
./gradlew assembleRelease

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ 构建失败${NC}"
    exit 1
fi

echo -e "${GREEN}✅ 构建成功${NC}"

# 签名 APK（需要创建密钥库）
APK_PATH="app/build/outputs/apk/release/app-release-unsigned.apk"
SIGNED_APK="app/build/outputs/apk/release/bid-assistant-pro-v1.0.0.apk"

if [ ! -f "release.keystore" ]; then
    echo ""
    echo "🔑 创建签名密钥库..."
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
echo ""
echo "✍️ 签名 APK..."
apksigner sign \
    --ks release.keystore \
    --ks-key-alias bidassistant \
    --ks-pass pass:bidassistant123 \
    --key-pass pass:bidassistant123 \
    --out "$SIGNED_APK" \
    "$APK_PATH"

echo -e "${GREEN}✅ APK 签名完成${NC}"
echo "📦 输出文件: $SIGNED_APK"

# 验证签名
echo ""
echo "🔍 验证签名..."
apksigner verify -v "$SIGNED_APK"

echo ""
echo "=================================="
echo -e "${GREEN}✅ Android App 构建完成！${NC}"
echo ""
echo "📱 上架步骤："
echo "1. 访问 https://play.google.com/console"
echo "2. 创建应用（一次性 $25 注册费）"
echo "3. 上传 APK: $SIGNED_APK"
echo "4. 填写应用信息"
echo "5. 提交审核"
echo ""
echo "⚠️ 注意：Google Play 首次注册需要 $25 美元"
echo ""
