module.exports = (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: '招标助手 Pro API 运行正常',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
};
