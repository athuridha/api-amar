-- Rumah123 Scraper License System
-- Run this in Supabase SQL Editor

-- ===========================================
-- Add device_id to existing table (if needed)
-- ===========================================
ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS device_id VARCHAR(64);
CREATE INDEX IF NOT EXISTS idx_usage_device_date ON usage_logs(device_id, date);

-- ===========================================
-- Create admin_settings table for password
-- ===========================================
CREATE TABLE IF NOT EXISTS admin_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    password_hash VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT single_row CHECK (id = 1)
);

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role access admin_settings" ON admin_settings;
CREATE POLICY "Service role access admin_settings" ON admin_settings
    FOR ALL USING (auth.role() = 'service_role');

-- Set default password: admin123 (SHA256 hash)
INSERT INTO admin_settings (id, password_hash)
VALUES (1, '240be518fabd2724ddb6f04eeb9d5b9db2b0d3c3c0d4e5f6a7b8c9d0e1f2a3b4')
ON CONFLICT (id) DO NOTHING;

-- ===========================================
-- Full Schema
-- ===========================================

CREATE TABLE IF NOT EXISTS licenses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    license_key VARCHAR(64) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    plan VARCHAR(20) DEFAULT 'pro' CHECK (plan IN ('pro', 'enterprise')),
    daily_limit INTEGER DEFAULT 10000,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    license_id UUID REFERENCES licenses(id) ON DELETE CASCADE,
    device_id VARCHAR(64),
    date DATE NOT NULL,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_usage_license_date ON usage_logs(license_id, date);
CREATE INDEX IF NOT EXISTS idx_usage_device_date ON usage_logs(device_id, date);

ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role access licenses" ON licenses;
DROP POLICY IF EXISTS "Service role access usage" ON usage_logs;

CREATE POLICY "Service role access licenses" ON licenses
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role access usage" ON usage_logs
    FOR ALL USING (auth.role() = 'service_role');
