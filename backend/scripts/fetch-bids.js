const { chromium } = require('playwright-core');
const { Pool } = require('pg');
const cheerio = require('cheerio');

// 数据库连接
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bid_assistant',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || ''
});

// 统一保存招标信息
async function saveBid(bid) {
  try {
    // 检查是否已存在（基于标题和来源）
    const existing = await pool.query(
      'SELECT id FROM bids WHERE title = $1 AND source = $2',
      [bid.title, bid.source]
    );
    
    if (existing.rows.length > 0) {
      console.log(`已存在: ${bid.title.substring(0, 50)}...`);
      return null;
    }
    
    const result = await pool.query(
      `INSERT INTO bids (source, source_name, title, content, publish_date, deadline, url, status, keywords)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [
        bid.source,
        bid.sourceName,
        bid.title,
        bid.content || '',
        bid.publishDate || new Date(),
        bid.deadline || null,
        bid.url || '',
        'active',
        JSON.stringify(bid.keywords || [])
      ]
    );
    
    console.log(`✅ 保存成功 [${bid.sourceName}]: ${bid.title.substring(0, 50)}...`);
    return result.rows[0].id;
  } catch (error) {
    console.error('保存失败:', error);
    return null;
  }
}

// 抓取一汽招标
async function fetchFaw() {
  console.log('\n📡 抓取一汽招标...');
  const bids = [];
  
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    // 一汽招标页面
    await page.goto('https://etp.faw.cn/', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    
    // 尝试点击招标公告栏目
    try {
      await page.click('text=招标公告');
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log('未找到招标公告按钮，尝试直接解析页面');
    }
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    // 解析招标列表（根据实际页面结构调整）
    $('.list-item, .news-item, tr, .item').each((i, el) => {
      const title = $(el).find('.title, .name, td:nth-child(2), a').text().trim();
      const date = $(el).find('.date, .time, td:nth-child(3)').text().trim();
      const link = $(el).find('a').attr('href');
      
      if (title && title.length > 10) {
        bids.push({
          source: 'faw',
          sourceName: '一汽',
          title: title,
          content: '',
          publishDate: parseDate(date),
          deadline: null,
          url: link ? (link.startsWith('http') ? link : `https://etp.faw.cn${link}`) : '',
          keywords: extractKeywords(title)
        });
      }
    });
    
    await browser.close();
    console.log(`✅ 一汽抓取完成: ${bids.length} 条`);
    return bids;
  } catch (error) {
    console.error('❌ 一汽抓取失败:', error.message);
    return [];
  }
}

// 抓取东风招标
async function fetchDongfeng() {
  console.log('\n📡 抓取东风招标...');
  const bids = [];
  
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto('https://etp.dfmc.com.cn/jyxx/004001/trade_info_new.html', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    await page.waitForTimeout(3000);
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    // 解析招标列表
    $('tr, .item, .list-item').each((i, el) => {
      const cells = $(el).find('td');
      if (cells.length >= 2) {
        const title = $(cells[0]).text().trim();
        const date = $(cells[1]).text().trim();
        const link = $(cells[0]).find('a').attr('href');
        
        if (title && title.length > 10) {
          bids.push({
            source: 'dongfeng',
            sourceName: '东风',
            title: title,
            content: '',
            publishDate: parseDate(date),
            deadline: null,
            url: link ? (link.startsWith('http') ? link : `https://etp.dfmc.com.cn${link}`) : '',
            keywords: extractKeywords(title)
          });
        }
      }
    });
    
    await browser.close();
    console.log(`✅ 东风抓取完成: ${bids.length} 条`);
    return bids;
  } catch (error) {
    console.error('❌ 东风抓取失败:', error.message);
    return [];
  }
}

// 抓取零跑招标
async function fetchLeapmotor() {
  console.log('\n📡 抓取零跑招标...');
  const bids = [];
  
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    
    await page.goto('https://cn.leapmotor.com/join/callForBids.html', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    await page.waitForTimeout(3000);
    
    // 滚动加载更多
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    // 解析招标表格
    $('table tr').each((i, el) => {
      const cells = $(el).find('td');
      if (cells.length >= 3) {
        const title = $(cells[0]).text().trim();
        const publishDate = $(cells[1]).text().trim();
        const deadline = $(cells[2]).text().trim();
        
        if (title && title.length > 5) {
          bids.push({
            source: 'leapmotor',
            sourceName: '零跑',
            title: title,
            content: '',
            publishDate: parseDate(publishDate),
            deadline: parseDate(deadline),
            url: 'https://cn.leapmotor.com/join/callForBids.html',
            keywords: extractKeywords(title)
          });
        }
      }
    });
    
    await browser.close();
    console.log(`✅ 零跑抓取完成: ${bids.length} 条`);
    return bids;
  } catch (error) {
    console.error('❌ 零跑抓取失败:', error.message);
    return [];
  }
}

// 解析日期
function parseDate(dateStr) {
  if (!dateStr) return null;
  
  // 尝试多种日期格式
  const patterns = [
    /(\d{4})[/-](\d{1,2})[/-](\d{1,2})/,
    /(\d{4})年(\d{1,2})月(\d{1,2})日/,
    /(\d{1,2})[/-](\d{1,2})[/-](\d{4})/
  ];
  
  for (const pattern of patterns) {
    const match = dateStr.match(pattern);
    if (match) {
      if (pattern === patterns[2]) {
        return new Date(`${match[3]}-${match[1]}-${match[2]}`);
      }
      return new Date(`${match[1]}-${match[2]}-${match[3]}`);
    }
  }
  
  return new Date();
}

// 提取关键词
function extractKeywords(title) {
  const keywords = [];
  const keywordList = [
    '新能源', '电动', '电池', '电机', '电控',
    '智能驾驶', '自动驾驶', 'ADAS',
    '车联网', '智能座舱',
    '零部件', '供应商', '采购',
    '活动', '展会', '发布会',
    '运营', '服务', '售后',
    '北京', '上海', '广州', '深圳', '杭州', '重庆', '武汉'
  ];
  
  for (const kw of keywordList) {
    if (title.includes(kw)) {
      keywords.push(kw);
    }
  }
  
  return keywords;
}

// 主函数
async function main() {
  console.log('\n========================================');
  console.log('🚀 招标助手 Pro - 数据抓取');
  console.log(`⏰ 开始时间: ${new Date().toLocaleString()}`);
  console.log('========================================\n');
  
  let totalSaved = 0;
  
  // 抓取一汽
  const fawBids = await fetchFaw();
  for (const bid of fawBids) {
    const id = await saveBid(bid);
    if (id) totalSaved++;
  }
  
  // 抓取东风
  const dongfengBids = await fetchDongfeng();
  for (const bid of dongfengBids) {
    const id = await saveBid(bid);
    if (id) totalSaved++;
  }
  
  // 抓取零跑
  const leapmotorBids = await fetchLeapmotor();
  for (const bid of leapmotorBids) {
    const id = await saveBid(bid);
    if (id) totalSaved++;
  }
  
  console.log('\n========================================');
  console.log(`✅ 抓取完成! 新增: ${totalSaved} 条`);
  console.log(`⏰ 结束时间: ${new Date().toLocaleString()}`);
  console.log('========================================\n');
  
  await pool.end();
  process.exit(0);
}

main().catch(error => {
  console.error('程序错误:', error);
  pool.end();
  process.exit(1);
});
