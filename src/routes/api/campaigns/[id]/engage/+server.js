import { json, error } from '@sveltejs/kit';
import { Campaign, CampaignHelpers } from '$lib/server/db/models/index';

// Note: Rate limiting would be best handled with a package like 'sveltekit-rate-limiter'
// You would wrap the POST function with the limiter.

// POST /api/campaigns/:id/engage
export async function POST({ request, params, locals, getClientAddress }) {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  
  try {
    const body = await request.json();
    const campaignId = params.id;
    const engagementData = {
      ipAddress: getClientAddress(),
      userAgent: request.headers.get('User-Agent') || 'Unknown',
      referrer: request.headers.get('Referer') || '',
      deviceInfo: request.headers.get('User-Agent') || 'Unknown'
    };
    
    const engagement = await CampaignHelpers.recordEngagement(
      campaignId,
      locals.user._id,
      engagementData,
      body.username,
    );
    
    const campaign = await Campaign.findById(campaignId)
      .populate('userId', 'name picture');
      
    return json({
      engagement,
      campaign,
      earned: campaign.costPerAction||3 // You might want to make this dynamic
    }, { status: 201 });
      
  } catch (err) {
    throw error(400, err.message);
  }
}