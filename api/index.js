const express = require('express');
const app = express();
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: '招标助手 Pro 后端服务运行正常'
  });
});

// 测试 API
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    data: {
      message: 'API 测试成功',
      version: '1.0.0'
    }
  });
});

// 获取招标列表（模拟数据）
app.get('/api/bids', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, title: '示例招标项目 1', source: '一汽', date: '2026-03-19' },
      { id: 2, title: '示例招标项目 2', source: '东风', date: '2026-03-19' },
      { id: 3, title: '示例招标项目 3', source: '零跑', date: '2026-03-18' }
    ]
  });
});

// 首页
app.get('/', (req, res) => {
  res.json({
    name: '招标助手 Pro API',
    version: '1.0.0',
    endpoints: [
      '/health - 健康检查',
      '/api/test - 测试接口',
      '/api/bids - 招标列表'
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务启动，端口: ${PORT}`);
});

module.exports = app;
