import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zscbibomcdrzyllgktob.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpzY2JpYm9tY2RyenlsbGdrdG9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTE1OTQsImV4cCI6MjA4NTc4NzU5NH0.Xz3ubrGRqjAomF6jtB091v9g5yXWkadE_6pT5Yenzso';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyTables() {
    console.log('Verificando tabelas no Supabase Master...');

    const tables = ['classes', 'students', 'activities', 'submissions'];

    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
        if (error) {
            console.error(`❌ Erro na tabela [${table}]:`, error.message);
        } else {
            console.log(`✅ Tabela [${table}] acessível.`);
        }
    }
}

verifyTables();
