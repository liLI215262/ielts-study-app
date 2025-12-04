// 文件路径: src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// ⚠️ 请去 Supabase 网站 -> Project Settings -> API 
// 复制你的 URL 和 anon public key 替换下面的内容
const supabaseUrl = 'https://hxsllvnnocaqoamfntja.supabase.co' 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4c2xsdm5ub2NhcW9hbWZudGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NTg2OTgsImV4cCI6MjA4MDMzNDY5OH0.f9PIXhYv2qiTvBegJZgNajlW0M0EBhk9v-vrCIEW1Hk'

export const supabase = createClient(supabaseUrl, supabaseKey)