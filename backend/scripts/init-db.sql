-- 数据库初始化脚本

-- 招标信息表
CREATE TABLE IF NOT EXISTS bids (
  id SERIAL PRIMARY KEY,
  source VARCHAR(50) NOT NULL, -- 来源：faw, dongfeng, leapmotor
  source_name VARCHAR(100), -- 来源名称
  title VARCHAR(500) NOT NULL, -- 标题
  content TEXT, -- 内容
  publish_date DATE, -- 发布日期
  deadline DATE, -- 截止日期
  url VARCHAR(1000), -- 原文链接
  status VARCHAR(20) DEFAULT 'active', -- 状态：active, expired, cancelled
  keywords JSONB, -- 匹配的关键词
  ai_analysis JSONB, -- AI 分析结果
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_bids_source ON bids(source);
CREATE INDEX idx_bids_publish_date ON bids(publish_date DESC);
CREATE INDEX idx_bids_status ON bids(status);

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  subscription_type VARCHAR(20) DEFAULT 'free', -- free, monthly, yearly
  subscription_expire_at TIMESTAMP,
  push_settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户筛选规则表
CREATE TABLE IF NOT EXISTS user_filters (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(100), -- 规则名称
  keywords TEXT[], -- 关键词列表
  sources TEXT[], -- 关注的平台
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

-- 推送记录表
CREATE TABLE IF NOT EXISTS push_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  bid_id INTEGER REFERENCES bids(id),
  channel VARCHAR(20), -- app, feishu, dingtalk, wecom
  status VARCHAR(20), -- success, failed
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
