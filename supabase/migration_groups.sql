-- migration_groups.sql
-- Create tables for group features: finance tracking and chat summarization

-- 1. Groups table
CREATE TABLE IF NOT EXISTS public.groups (
  chat_id bigint PRIMARY KEY,
  title text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.groups FROM anon, authenticated;

-- 2. Transactions table (Income/Expense)
CREATE TABLE IF NOT EXISTS public.transactions (
  id bigserial PRIMARY KEY,
  chat_id bigint NOT NULL REFERENCES public.groups(chat_id) ON DELETE CASCADE,
  user_id bigint NOT NULL,
  amount numeric(12,2) NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  trx_type text NOT NULL CHECK (trx_type IN ('income', 'expense')),
  description text,
  trx_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_transactions_chat ON public.transactions(chat_id);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.transactions FROM anon, authenticated;

-- 3. Group Messages table (Temporary storage for summarization)
CREATE TABLE IF NOT EXISTS public.group_messages (
  id bigserial PRIMARY KEY,
  chat_id bigint NOT NULL REFERENCES public.groups(chat_id) ON DELETE CASCADE,
  user_id bigint NOT NULL,
  username text,
  text_content text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_group_messages_chat ON public.group_messages(chat_id);
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.group_messages FROM anon, authenticated;
