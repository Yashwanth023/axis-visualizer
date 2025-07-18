// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://adwjqqztcqlazlpbaoqj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkd2pxcXp0Y3FsYXpscGJhb3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNDM1NzEsImV4cCI6MjA2NzkxOTU3MX0.qpOAc_7R3ndUGkRYJO7bC-Nk6kxZkOABXD6LgVBBXOQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});