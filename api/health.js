// Vercel Serverless API - 健康检查
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  res.json({
    status: 'ok',
    service: '招标助手 Pro API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
};
