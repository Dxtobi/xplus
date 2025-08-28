
import { redirect } from '@sveltejs/kit';

export async function POST({ cookies, locals }) {
  cookies.delete('auth_token', { path: '/' });
    locals.user = null
    
  throw redirect(302, '/login');
}