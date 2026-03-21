// Vercel Serverless API - 招标列表
const { Pool } = require('pg');

// 数据库连接池
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { source, keyword, page = 1, limit = 20 } = req.query;
    
    let query = `
      SELECT 
        id, source, source_name, title, content,
        publish_date, deadline, url, status,
        keywords, ai_analysis, created_at
      FROM bids 
      WHERE status = 'active'
    `;
    const params = [];
    
    if (source && source !== 'all') {
      params.push(source);
      query += ` AND source = $${params.length}`;
    }
    
    if (keyword) {
      params.push(`%${keyword}%`);
      query += ` AND (title ILIKE $${params.length} OR content ILIKE $${params.length})`;
    }
    
    // 获取总数
    const countResult = await pool.query(
      query.replace(/SELECT[\s\S]*?FROM/, 'SELECT COUNT(*) FROM'),
      params
    );
    const total = parseInt(countResult.rows[0].count);
    
    // 添加排序和分页
    query += ' ORDER BY publish_date DESC';
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      data: result.rows.map(row => ({
        ...row,
        keywords: row.keywords || [],
        ai_analysis: row.ai_analysis || null
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      message: error.message 
    });
  }
};
