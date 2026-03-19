# Vercel 环境变量配置

需要在 Vercel 添加以下环境变量：

Key: DB_PASSWORD
Value: (你的 Supabase 数据库密码)

配置步骤：
1. 打开 https://vercel.com/dashboard
2. 进入 bid-assistant-pro 项目
3. 点击 Settings
4. 点击 Environment Variables
5. 添加 DB_PASSWORD = (你的密码)
6. 点击 Save
7. 点击 Redeploy 重新部署

其他变量已配置：
- DB_HOST = db.bnpjqjngfyuhluvnywbz.supabase.co
- DB_PORT = 5432
- DB_NAME = postgres
- DB_USER = postgres
