#!/bin/bash
# 推送代码到 GitHub 脚本

cd ~/.openclaw/workspace/apps/bid-assistant-pro

# 配置 Git 用户信息（请修改为你的信息）
git config user.name "rundong777-pixel"
git config user.email "your-email@example.com"

# 设置远程仓库
git remote remove origin 2>/dev/null
git remote add origin https://github.com/rundong777-pixel/bid-assistant-pro.git

# 推送代码
echo "正在推送代码到 GitHub..."
git push -u origin main

echo "完成！"
