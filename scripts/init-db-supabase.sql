-- 招标助手 Pro 数据库初始化脚本
-- 在 Supabase SQL Editor 中执行

-- 招标信息表
CREATE TABLE IF NOT EXISTS bids (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50) NOT NULL,
  source_name VARCHAR(100),
  title VARCHAR(500) NOT NULL,
  content TEXT,
  publish_date DATE,
  deadline DATE,
  url VARCHAR(1000),
  status VARCHAR(20) DEFAULT 'active',
  keywords JSONB,
  ai_analysis JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_bids_source ON bids(source);
CREATE INDEX IF NOT EXISTS idx_bids_publish_date ON bids(publish_date DESC);
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  subscription_type VARCHAR(20) DEFAULT 'free',
  subscription_expire_at TIMESTAMP,
  push_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户筛选规则表
CREATE TABLE IF NOT EXISTS user_filters (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(100),
  keywords TEXT[],
  sources TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户收藏表
CREATE TABLE IF NOT EXISTS user_favorites (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  bid_id INTEGER REFERENCES bids(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, bid_id)
);

-- 插入测试数据
INSERT INTO bids (source, source_name, title, publish_date, deadline, status) VALUES
('faw', '一汽', '2026年奔腾海湾认证服务项目', '2026-03-18', '2026-04-18', 'active'),
('faw', '一汽', '2026年奔腾欧标认证服务项目', '2026-03-18', '2026-04-18', 'active'),
('dongfeng', '东风', '东风奕派2026-2027年区域新媒体运营项目', '2026-03-18', '2026-03-23', 'active'),
('leapmotor', '零跑', '2026年度零跑汽车海外市场营销代理招标公告', '2026-03-18', '2026-03-31', 'active');
