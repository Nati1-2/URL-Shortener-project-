-- LinkPulse Database-Per-Service Initialization Script
-- Executed on initial PostgreSQL container startup

CREATE DATABASE auth_db;
CREATE DATABASE link_db;
CREATE DATABASE analytics_db;
CREATE DATABASE workspace_db;
CREATE DATABASE domain_db;
CREATE DATABASE billing_db;
CREATE DATABASE notification_db;

GRANT ALL PRIVILEGES ON DATABASE auth_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE link_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE analytics_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE workspace_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE domain_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE billing_db TO postgres;
GRANT ALL PRIVILEGES ON DATABASE notification_db TO postgres;
