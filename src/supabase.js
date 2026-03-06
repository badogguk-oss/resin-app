const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://https://hvuymucimfzriqlfbwq.supabase.co.supabase.co'
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_yn67p4f2KC4BDJY1fETQDw_LVM5Q967'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
