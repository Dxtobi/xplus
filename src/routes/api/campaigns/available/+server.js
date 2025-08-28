import { json, error } from '@sveltejs/kit';
import { ApiHelpers } from '$lib/server/db/models/index';

// GET /api/campaigns/available
export async function GET({ url, locals, event }) {
  
   if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  
  try {
    const page = url.searchParams.get('page') || 1;
    const limit = url.searchParams.get('limit') || 20;
    const platform = url.searchParams.get('platform');
    const actionType = url.searchParams.get('actionType');
    const category = url.searchParams.get('category');
    
    const filters = { platform, actionType, category };
    
    const result = await ApiHelpers.getAvailableCampaigns(locals.user._id, page, limit, filters);
    return json(result);
  } catch (err) {
    throw error(500, 'Failed to fetch available campaigns');
  }
}