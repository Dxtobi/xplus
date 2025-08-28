import { redirect } from '@sveltejs/kit';
import { GoogleOAuthService } from '$lib/server/google-oauth.js';

export async function GET() {
  const authUrl = GoogleOAuthService.getAuthUrl();
  throw redirect(302, authUrl);
}