-- Create HMRC tokens table
CREATE TABLE IF NOT EXISTS hmrc_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_token TEXT NOT NULL,
    refresh_token TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_hmrc_tokens_user_id ON hmrc_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_hmrc_tokens_expires_at ON hmrc_tokens(expires_at); 