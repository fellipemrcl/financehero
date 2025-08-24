-- PostgreSQL Initialization Script for FinanceHero
-- This script runs automatically when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Set timezone
SET timezone = 'America/Sao_Paulo';

-- Create additional database for testing (optional)
-- SELECT 'CREATE DATABASE financehero_test' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'financehero_test')\gexec

-- Optimize PostgreSQL settings for development
ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_duration = on;
ALTER SYSTEM SET log_min_duration_statement = 1000;

-- Reload configuration
SELECT pg_reload_conf();

-- Log initialization completion
DO $$
BEGIN
    RAISE NOTICE 'FinanceHero PostgreSQL database initialized successfully!';
END $$;
