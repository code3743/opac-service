CREATE TABLE IF NOT EXISTS scraping_sessions (
  id UUID PRIMARY KEY,
  type VARCHAR(20) CHECK (type IN ('anonymous', 'student')),
  student_code TEXT,
  encrypted_data TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id UUID PRIMARY KEY,
  user_id TEXT, -- student_code
  token_hash TEXT NOT NULL,
  replaced_by UUID,
  revoked BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  expires_at TIMESTAMP
);
