const express = require('express');
const cron = require('node-cron');
const { Pool } = require('pg');
const redis = require('redis');
require('dotenv').config();

const app = express();
app.use(express.json());

// 数据库连接
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bid_assistant',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || ''
});

// Redis 连接
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect();

// 招标数据源配置
const DATA_SOURCES = {
  faw: {
    name: '一汽',
    url: 'https://etp.faw.cn/',
    type: 'web_fetch'
  },
  dongfeng: {
    name: '东风',
    url: 'https://etp.dfmc.com.cn/jyxx/004001/trade_info_new.html',
    type: 'web_fetch'
  },
  leapmotor: {
    name: '零跑',
    url: 'https://cn.leapmotor.com/join/callForBids.html',
    type: 'playwright'
  }
};

// 启动抓取任务（每30分钟）
cron.schedule('*/30 * * * *', async () => {
  console.log('开始抓取招标信息...', new Date());
  // 抓取逻辑将在后续实现
});

// API 路由

// 获取最新招标列表
app.get('/api/bids', async (req, res) => {
  try {
    const { source, keyword, page = 1, limit = 20 } = req.query;
    let query = 'SELECT * FROM bids WHERE 1=1';
    const params = [];
    
    if (source) {
      params.push(source);
      query += ` AND source = $${params.length}`;
    }
    
    if (keyword) {
      params.push(`%${keyword}%`);
      query += ` AND (title ILIKE $${params.length} OR content ILIKE $${params.length})`;
    }
    
    query += ' ORDER BY publish_date DESC';
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, (page - 1) * limit);
    
    const result = await pool.query(query, params);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('获取招标列表失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 获取招标详情
app.get('/api/bids/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM bids WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: '招标信息不存在' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('获取招标详情失败:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`招标助手 Pro 后端服务启动，端口: ${PORT}`);
});
