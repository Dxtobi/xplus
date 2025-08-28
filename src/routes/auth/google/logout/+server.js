import { redirect } from '@sveltejs/kit';

export async function POST({ cookies }) {
  cookies.delete('auth_token', { path: '/' });
  throw redirect(302, '/login');
}