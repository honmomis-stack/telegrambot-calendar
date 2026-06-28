-- migration_gemini_key.sql
-- Run this in Supabase SQL Editor to add the column for the encrypted Gemini API key

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS gemini_api_key text DEFAULT NULL;
