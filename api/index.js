module.exports = async (req, res) => {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const path = req.url.split('?')[0];
  
  // 健康检查
  if (path === '/' || path === '/health') {
    return res.status(200).json({
      status: 'ok',
      message: '招标助手 Pro API 运行正常',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }
  
  // 招标列表
  if (path === '/api/bids') {
    return res.status(200).json({
      success: true,
      count: 4,
      data: [
        { id: 1, source: 'faw', source_name: '一汽', title: '2026年奔腾海湾认证服务项目', publish_date: '2026-03-18', deadline: '2026-04-18', status: 'active' },
        { id: 2, source: 'faw', source_name: '一汽', title: '2026年奔腾欧标认证服务项目', publish_date: '2026-03-18', deadline: '2026-04-18', status: 'active' },
        { id: 3, source: 'dongfeng', source_name: '东风', title: '东风奕派2026-2027年区域新媒体运营项目', publish_date: '2026-03-18', deadline: '2026-03-23', status: 'active' },
        { id: 4, source: 'leapmotor', source_name: '零跑', title: '2026年度零跑汽车海外市场营销代理招标公告', publish_date: '2026-03-18', deadline: '2026-03-31', status: 'active' }
      ]
    });
  }
  
  // 网页版
  if (path === '/web' || path.startsWith('/web/')) {
    return res.status(200).send(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>招标助手 Pro</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, sans-serif; background: #f5f5f7; }
        .header { background: #007aff; color: white; padding: 16px 20px; }
        .header h1 { font-size: 20px; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .bid-card { background: white; border-radius: 16px; padding: 16px; margin-bottom: 12px; }
        .source-tag { padding: 4px 12px; border-radius: 6px; font-size: 13px; font-weight: 600; }
        .source-faw { background: #ffebee; color: #c62828; }
        .source-dongfeng { background: #e3f2fd; color: #1565c0; }
        .source-leapmotor { background: #e8f5e9; color: #2e7d32; }
        .bid-title { font-size: 16px; font-weight: 500; margin: 12px 0; }
        .bid-footer { display: flex; justify-content: space-between; color: #666; font-size: 13px; }
    </style>
</head>
<body>
    <div class="header"><h1>招标助手 Pro</h1></div>
    <div class="container" id="content"></div>
    <script>
        fetch('/api/bids')
            .then(r => r.json())
            .then(data => {
                document.getElementById('content').innerHTML = data.data.map(bid => \`
                    <div class="bid-card">
                        <span class="source-tag source-\${bid.source}">\${bid.source_name}</span>
                        <div class="bid-title">\${bid.title}</div>
                        <div class="bid-footer">
                            <span>发布: \${bid.publish_date}</span>
                            <span>截止: \${bid.deadline}</span>
                        </div>
                    </div>
                \`).join('');
            });
    </script>
</body>
</html>
    `);
  }
  
  // 默认响应
  return res.status(200).json({
    name: '招标助手 Pro API',
    version: '1.0.0',
    endpoints: [
      '/ - 健康检查',
      '/api/bids - 招标列表',
      '/web - 网页版'
    ]
  });
};
