const { Pool } = require('pg');

// 数据库连接池
const pool = new Pool({
  host: process.env.DB_HOST || 'db.bnpjqjngfyuhluvnywbz.supabase.co',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

module.exports = async (req, res) => {
  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const path = req.url.split('?')[0];
  
  try {
    // 健康检查
    if (path === '/' || path === '/health') {
      const dbResult = await pool.query('SELECT NOW() as time');
      return res.status(200).json({
        status: 'ok',
        message: '招标助手 Pro API 运行正常',
        timestamp: new Date().toISOString(),
        database: 'connected',
        dbTime: dbResult.rows[0].time
      });
    }
    
    // 获取招标列表
    if (path === '/api/bids') {
      const result = await pool.query(
        'SELECT * FROM bids ORDER BY publish_date DESC LIMIT 20'
      );
      return res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows
      });
    }
    
    // 默认响应
    return res.status(200).json({
      name: '招标助手 Pro API',
      version: '1.0.0',
      endpoints: [
        '/ - 健康检查',
        '/api/bids - 招标列表'
      ]
    });
    
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
