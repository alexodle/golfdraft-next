import { createServerClient, type CookieOptions, serialize } from '@supabase/ssr';
import { type NextApiRequest, type NextApiResponse } from 'next';
import { supabaseAnonKey, supabaseUrl } from './constants';

export default function createClient(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return req.cookies[name];
      },
      set(name: string, value: string, options: CookieOptions) {
        res.appendHeader('Set-Cookie', serialize(name, value, options));
      },
      remove(name: string, options: CookieOptions) {
        res.appendHeader('Set-Cookie', serialize(name, '', options));
      },
    },
  });

  return supabase;
}
