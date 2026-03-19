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
  
  // 招标列表（丰富数据）
  if (path === '/api/bids') {
    return res.status(200).json({
      success: true,
      count: 15,
      data: [
        // 一汽招标
        { id: 1, source: 'faw', source_name: '一汽', title: '2026年奔腾海湾认证服务项目', publish_date: '2026-03-19', deadline: '2026-04-18', status: 'active', type: '服务', company: '一汽奔腾国际汽车（长春）有限公司', budget: '50-100万' },
        { id: 2, source: 'faw', source_name: '一汽', title: '2026年奔腾欧标认证服务项目', publish_date: '2026-03-19', deadline: '2026-04-18', status: 'active', type: '服务', company: '一汽奔腾国际汽车（长春）有限公司', budget: '50-100万' },
        { id: 3, source: 'faw', source_name: '一汽', title: '2026-2029年进出口通商公司大连地区作业基地租赁项目', publish_date: '2026-03-18', deadline: '2026-04-15', status: 'active', type: '租赁', company: '一汽（大连）通商有限公司', budget: '200-500万' },
        { id: 4, source: 'faw', source_name: '一汽', title: '一汽铸造有限公司 PDM产品数据管理系统（二次）', publish_date: '2026-03-18', deadline: '2026-04-10', status: 'active', type: '软件', company: '一汽铸造有限公司', budget: '100-200万' },
        { id: 5, source: 'faw', source_name: '一汽', title: '中汽测评2026年度融媒体运营服务', publish_date: '2026-03-17', deadline: '2026-03-30', status: 'active', type: '运营', company: '中国汽车技术研究中心有限公司', budget: '300-500万' },
        
        // 东风招标
        { id: 6, source: 'dongfeng', source_name: '东风', title: '东风奕派2026-2027年区域新媒体运营项目（河南、华北、华东、华南、山东）', publish_date: '2026-03-19', deadline: '2026-03-23', status: 'active', type: '运营', company: '东风奕派汽车销售(武汉)有限公司', budget: '500-800万' },
        { id: 7, source: 'dongfeng', source_name: '东风', title: '东风奕派2026-2027年区域新媒体运营项目（湖北、东南、西南、西北、中南）', publish_date: '2026-03-19', deadline: '2026-03-23', status: 'active', type: '运营', company: '东风奕派汽车销售(武汉)有限公司', budget: '500-800万' },
        { id: 8, source: 'dongfeng', source_name: '东风', title: '2026年黄金工厂焊装总装暖通&动力工程项目', publish_date: '2026-03-19', deadline: '2026-03-23', status: 'active', type: '工程', company: '岚图汽车科技股份有限公司', budget: '1000-2000万' },
        { id: 9, source: 'dongfeng', source_name: '东风', title: '2026年猛士汽车用户中心及零售中心设计项目', publish_date: '2026-03-18', deadline: '2026-03-21', status: 'active', type: '设计', company: '东风汽车集团股份有限公司猛士汽车科技公司', budget: '200-400万' },
        { id: 10, source: 'dongfeng', source_name: '东风', title: '2026东风Honda NPS调研服务合作项目', publish_date: '2026-03-18', deadline: '2026-03-21', status: 'active', type: '调研', company: '东风本田汽车有限公司', budget: '100-200万' },
        
        // 零跑招标
        { id: 11, source: 'leapmotor', source_name: '零跑', title: '2026年度零跑汽车海外市场营销代理招标公告', publish_date: '2026-03-18', deadline: '2026-03-31', status: 'active', type: '营销', company: '零跑汽车', budget: '800-1500万' },
        { id: 12, source: 'leapmotor', source_name: '零跑', title: '零跑汽车媒体试驾车运营管理项目招标公告', publish_date: '2026-03-18', deadline: '2026-03-22', status: 'active', type: '运营', company: '零跑汽车', budget: '100-200万' },
        { id: 13, source: 'leapmotor', source_name: '零跑', title: '零跑汽车服务部平面设计及视频拍摄项目', publish_date: '2026-03-17', deadline: '2026-03-23', status: 'active', type: '设计', company: '零跑汽车服务部', budget: '50-100万' },
        { id: 14, source: 'leapmotor', source_name: '零跑', title: '招标公告-零跑汽车内饰件自动装卡扣设备、热烫印设备及模具项目', publish_date: '2026-03-17', deadline: '2026-03-23', status: 'active', type: '设备', company: '零跑汽车', budget: '300-500万' },
        { id: 15, source: 'leapmotor', source_name: '零跑', title: '26年零跑汽车充电桩安装服务项目招标公告', publish_date: '2026-03-12', deadline: '2026-03-19', status: 'active', type: '服务', company: '零跑汽车', budget: '200-400万' }
      ]
    });
  }
  
  // 统计数据
  if (path === '/api/stats') {
    return res.status(200).json({
      success: true,
      data: {
        totalBids: 15,
        todayBids: 5,
        fawCount: 5,
        dongfengCount: 5,
        leapmotorCount: 5
      }
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
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f7; color: #1d1d1f; }
        
        .header { 
            background: linear-gradient(135deg, #007aff 0%, #5856d6 100%); 
            color: white; 
            padding: 20px; 
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 20px rgba(0,122,255,0.3);
        }
        .header h1 { font-size: 24px; font-weight: 700; }
        .header p { font-size: 14px; opacity: 0.9; margin-top: 4px; }
        
        .stats-bar {
            display: flex;
            justify-content: space-around;
            background: white;
            padding: 16px;
            margin: 16px;
            border-radius: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .stat-item { text-align: center; }
        .stat-value { font-size: 28px; font-weight: 700; color: #007aff; }
        .stat-label { font-size: 12px; color: #666; margin-top: 4px; }
        
        .container { max-width: 800px; margin: 0 auto; padding: 0 16px 80px; }
        
        .filter-bar {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
            overflow-x: auto;
            padding: 4px;
        }
        .filter-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            white-space: nowrap;
            transition: all 0.2s;
        }
        .filter-btn.active {
            background: #007aff;
            color: white;
        }
        .filter-btn:not(.active) {
            background: white;
            color: #666;
        }
        
        .bid-card { 
            background: white; 
            border-radius: 16px; 
            padding: 16px; 
            margin-bottom: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
            transition: transform 0.2s;
        }
        .bid-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        }
        
        .bid-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 12px; 
        }
        
        .source-tag { 
            padding: 4px 12px; 
            border-radius: 6px; 
            font-size: 13px; 
            font-weight: 600; 
        }
        .source-faw { background: #ffebee; color: #c62828; }
        .source-dongfeng { background: #e3f2fd; color: #1565c0; }
        .source-leapmotor { background: #e8f5e9; color: #2e7d32; }
        
        .type-tag {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            background: #f5f5f7;
            color: #666;
        }
        
        .bid-title { 
            font-size: 16px; 
            font-weight: 600; 
            line-height: 1.5; 
            margin-bottom: 12px; 
            color: #1d1d1f;
        }
        
        .bid-company {
            font-size: 13px;
            color: #666;
            margin-bottom: 12px;
        }
        
        .bid-footer { 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            padding-top: 12px;
            border-top: 1px solid #f0f0f0;
        }
        
        .deadline { 
            font-size: 13px; 
            color: #ff9500; 
            display: flex; 
            align-items: center; 
            gap: 4px; 
        }
        
        .budget {
            font-size: 13px;
            color: #34c759;
            font-weight: 500;
        }
        
        .status-tag { 
            padding: 4px 10px; 
            border-radius: 4px; 
            font-size: 12px; 
            font-weight: 500; 
        }
        .status-active { background: #e8f5e9; color: #2e7d32; }
        
        .loading, .empty {
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }
        
        .refresh-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: #007aff;
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,122,255,0.4);
        }
        .refresh-btn.spinning { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .nav-bottom {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: white;
            display: flex;
            justify-content: space-around;
            padding: 8px 0;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        }
        .nav-item {
            text-align: center;
            padding: 4px 16px;
            color: #666;
            font-size: 12px;
        }
        .nav-item.active {
            color: #007aff;
        }
        .nav-icon {
            font-size: 24px;
            margin-bottom: 2px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>招标助手 Pro</h1>
        <p>实时监控一汽、东风、零跑招标信息</p>
    </div>
    
    <div class="stats-bar" id="stats">
        <div class="stat-item">
            <div class="stat-value">-</div>
            <div class="stat-label">今日更新</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">-</div>
            <div class="stat-label">招标总数</div>
        </div>
        <div class="stat-item">
            <div class="stat-value">-</div>
            <div class="stat-label">进行中</div>
        </div>
    </div>
    
    <div class="container">
        <div class="filter-bar">
            <button class="filter-btn active" onclick="filterBids('all', this)">全部</button>
            <button class="filter-btn" onclick="filterBids('faw', this)">一汽</button>
            <button class="filter-btn" onclick="filterBids('dongfeng', this)">东风</button>
            <button class="filter-btn" onclick="filterBids('leapmotor', this)">零跑</button>
        </div>
        
        <div id="content">
            <div class="loading">加载中...</div>
        </div>
    </div>
    
    <button class="refresh-btn" onclick="fetchBids()" id="refreshBtn">↻</button>
    
    <script>
        let currentFilter = 'all';
        let allBids = [];
        
        async function fetchBids() {
            const btn = document.getElementById('refreshBtn');
            btn.classList.add('spinning');
            
            try {
                const [bidsRes, statsRes] = await Promise.all([
                    fetch('/api/bids'),
                    fetch('/api/stats')
                ]);
                
                const bidsData = await bidsRes.json();
                const statsData = await statsRes.json();
                
                if (bidsData.success) {
                    allBids = bidsData.data;
                    renderBids();
                }
                
                if (statsData.success) {
                    updateStats(statsData.data);
                }
            } catch (error) {
                document.getElementById('content').innerHTML = '<div class="empty">加载失败，请重试</div>';
            } finally {
                btn.classList.remove('spinning');
            }
        }
        
        function updateStats(stats) {
            const statValues = document.querySelectorAll('.stat-value');
            statValues[0].textContent = stats.todayBids;
            statValues[1].textContent = stats.totalBids;
            statValues[2].textContent = stats.totalBids;
        }
        
        function renderBids() {
            const content = document.getElementById('content');
            
            let bids = allBids;
            if (currentFilter !== 'all') {
                bids = allBids.filter(bid => bid.source === currentFilter);
            }
            
            if (bids.length === 0) {
                content.innerHTML = '<div class="empty">暂无招标信息</div>';
                return;
            }
            
            content.innerHTML = bids.map(bid => \`
                <div class="bid-card">
                    <div class="bid-header">
                        <span class="source-tag source-\${bid.source}">\${bid.source_name}</span>
                        <span class="type-tag">\${bid.type}</span>
                    </div>
                    <div class="bid-title">\${bid.title}</div>
                    <div class="bid-company">\${bid.company}</div>
                    <div class="bid-footer">
                        <span class="deadline">⏰ 截止: \${bid.deadline}</span>
                        <span class="budget">💰 \${bid.budget}</span>
                    </div>
                </div>
            \`).join('');
        }
        
        function filterBids(filter, btn) {
            currentFilter = filter;
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderBids();
        }
        
        fetchBids();
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
      '/api/stats - 统计数据',
      '/web - 网页版'
    ]
  });
};
