export const supabaseUrl = requireValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const supabaseAnonKey = requireValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function requireValue(v: string | undefined | null): string {
  if (!v) {
    throw new Error(`Missing required env var: ${v}`);
  }
  return v;
}
