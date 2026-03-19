const { chromium } = require('playwright-core');
const { Pool } = require('pg');

// 数据库连接
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bid_assistant',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || ''
});

// 抓取一汽招标
async function fetchFaw() {
  console.log('抓取一汽招标...');
  try {
    const response = await fetch('https://etp.faw.cn/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await response.text();
    // 解析逻辑待实现
    console.log('一汽抓取完成');
    return [];
  } catch (error) {
    console.error('一汽抓取失败:', error);
    return [];
  }
}

// 抓取东风招标
async function fetchDongfeng() {
  console.log('抓取东风招标...');
  try {
    const response = await fetch('https://etp.dfmc.com.cn/jyxx/004001/trade_info_new.html', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await response.text();
    // 解析逻辑待实现
    console.log('东风抓取完成');
    return [];
  } catch (error) {
    console.error('东风抓取失败:', error);
    return [];
  }
}

// 抓取零跑招标（使用 Playwright）
async function fetchLeapmotor() {
  console.log('抓取零跑招标...');
  const browser = await chromium.launch({ headless: true });
  
  try {
    const page = await browser.newPage();
    await page.goto('https://cn.leapmotor.com/join/callForBids.html', { 
      waitUntil: 'networkidle' 
    });
    await page.waitForTimeout(3000);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(2000);
    
    const bids = await page.evaluate(() => {
      const rows = document.querySelectorAll('table tr');
      const data = [];
      rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 3) {
          data.push({
            name: cells[0]?.innerText?.trim() || '',
            publish: cells[1]?.innerText?.trim() || '',
            deadline: cells[2]?.innerText?.trim() || ''
          });
        }
      });
      return data;
    });
    
    console.log(`零跑抓取完成，共 ${bids.length} 条`);
    return bids;
  } catch (error) {
    console.error('零跑抓取失败:', error);
    return [];
  } finally {
    await browser.close();
  }
}

// 保存到数据库
async function saveBids(bids, source) {
  for (const bid of bids) {
    try {
      await pool.query(
        `INSERT INTO bids (source, source_name, title, publish_date, deadline)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [source, getSourceName(source), bid.name, bid.publish, bid.deadline]
      );
    } catch (error) {
      console.error('保存失败:', error);
    }
  }
}

function getSourceName(source) {
  const names = {
    faw: '一汽',
    dongfeng: '东风',
    leapmotor: '零跑'
  };
  return names[source] || source;
}

// 主函数
async function main() {
  console.log('开始抓取招标信息...', new Date());
  
  const fawBids = await fetchFaw();
  await saveBids(fawBids, 'faw');
  
  const dongfengBids = await fetchDongfeng();
  await saveBids(dongfengBids, 'dongfeng');
  
  const leapmotorBids = await fetchLeapmotor();
  await saveBids(leapmotorBids, 'leapmotor');
  
  console.log('抓取完成', new Date());
  await pool.end();
}

main().catch(console.error);
