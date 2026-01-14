-- Rumah123 Scraper License System
-- Run this in Supabase SQL Editor

-- ===========================================
-- Add device_id to usage_logs (if needed)
-- ===========================================
-- ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS device_id VARCHAR(64);
-- CREATE INDEX IF NOT EXISTS idx_usage_device_date ON usage_logs(device_id, date);

-- ===========================================
-- Create admins table for login
-- ===========================================
CREATE TABLE IF NOT EXISTS admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role access admins" ON admins;
CREATE POLICY "Service role access admins" ON admins
    FOR ALL USING (auth.role() = 'service_role');

-- Insert admin: athuridha / Amar130803@
INSERT INTO admins (username, password_hash)
VALUES ('athuridha', '574de02538587a95db2c37200e50c0b059825a59f3c2ab33e8ffe9c5b98f925b')
ON CONFLICT (username) 
DO UPDATE SET password_hash = EXCLUDED.password_hash;

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
