-- Rumah123 Scraper License System
-- Run this in Supabase SQL Editor

-- ===========================================
-- OPTION 1: Fresh Install (drop existing tables)
-- ===========================================
-- Uncomment lines below if you want to start fresh:
-- DROP TABLE IF EXISTS usage_logs;
-- DROP TABLE IF EXISTS licenses;

-- ===========================================
-- OPTION 2: Add device_id to existing table
-- ===========================================
-- Run this if you already have the tables:
ALTER TABLE usage_logs ADD COLUMN IF NOT EXISTS device_id VARCHAR(64);
CREATE INDEX IF NOT EXISTS idx_usage_device_date ON usage_logs(device_id, date);

-- ===========================================
-- Full Schema (for fresh install)
-- ===========================================

-- Create licenses table
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

-- Create usage_logs table
CREATE TABLE IF NOT EXISTS usage_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    license_id UUID REFERENCES licenses(id) ON DELETE CASCADE,
    device_id VARCHAR(64),
    date DATE NOT NULL,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(license_key);
CREATE INDEX IF NOT EXISTS idx_usage_license_date ON usage_logs(license_id, date);
CREATE INDEX IF NOT EXISTS idx_usage_device_date ON usage_logs(device_id, date);

-- Enable RLS
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Service role access licenses" ON licenses;
DROP POLICY IF EXISTS "Service role access usage" ON usage_logs;

CREATE POLICY "Service role access licenses" ON licenses
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role access usage" ON usage_logs
    FOR ALL USING (auth.role() = 'service_role');
