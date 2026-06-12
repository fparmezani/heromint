-- Run this in your Supabase SQL editor
CREATE TABLE IF NOT EXISTS template_overrides (
  theme_id   TEXT PRIMARY KEY,
  config     JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS (admin API uses service role, bypasses RLS)
ALTER TABLE template_overrides ENABLE ROW LEVEL SECURITY;

-- No public read/write — only service role key can access
