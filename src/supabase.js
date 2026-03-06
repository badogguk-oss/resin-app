import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hvuymucimfzriq1fbwq.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_yn67p4f2KC4BDJY1fETQDw_LVM5Q967'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
