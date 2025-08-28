import { json, error } from '@sveltejs/kit';
import { ApiHelpers } from '$lib/server/db/models/index';

// GET /api/user/analytics
export async function GET({ locals }) {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const analytics = await ApiHelpers.getUserAnalytics(locals.user._id);
    return json(analytics);
  } catch (err) {
    throw error(500, 'Failed to fetch analytics');
  }
}