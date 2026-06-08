CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TABLE IF NOT EXISTS public.recovery_email_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    user_name VARCHAR(255),
    collectible_id VARCHAR(255),
    theme_name VARCHAR(255) NOT NULL,
    package_type VARCHAR(50) NOT NULL,
    form_data JSONB NOT NULL DEFAULT '{}',
    client_ip VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'sent', 'skipped_paid', 'skipped_recent', 'failed')),
    email_sent_at TIMESTAMP WITH TIME ZONE,
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recovery_email_events_email
    ON public.recovery_email_events(user_email);

CREATE INDEX IF NOT EXISTS idx_recovery_email_events_status_created
    ON public.recovery_email_events(status, created_at);

CREATE INDEX IF NOT EXISTS idx_recovery_email_events_sent_at
    ON public.recovery_email_events(email_sent_at);

DROP TRIGGER IF EXISTS update_recovery_email_events_updated_at ON public.recovery_email_events;
CREATE TRIGGER update_recovery_email_events_updated_at
    BEFORE UPDATE ON public.recovery_email_events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.recovery_email_events ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.recovery_email_events IS 'Eventos de recuperacao de previews gerados sem compra';
