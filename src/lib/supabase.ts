import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types' 

const supabaseUrl = 'https://project-1-supabase.hlfbkz.easypanel.host'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyAgCiAgICAicm9sZSI6ICJhbm9uIiwKICAgICJpc3MiOiAic3VwYWJhc2UtZGVtbyIsCiAgICAiaWF0IjogMTY0MTc2OTIwMCwKICAgICJleHAiOiAxNzk5NTM1NjAwCn0.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE'

// With type safety
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

// Or without type safety if you haven't generated types yet
// export const supabase = createClient(supabaseUrl, supabaseKey)