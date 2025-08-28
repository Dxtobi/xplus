import { json, error } from '@sveltejs/kit';
import { Engagement } from '$lib/server/db/models/index';

// GET /api/engagements
export async function GET({ url, locals }) {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  
  try {
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    const engagements = await Engagement.find({ userId: locals.user._id })
      .populate('campaignId', 'title platform actionType')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
      
    const total = await Engagement.countDocuments({ userId: locals.user._id });
    
    return json({
      engagements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
    
  } catch (err) {
    throw error(500, 'Failed to fetch engagements');
  }
}