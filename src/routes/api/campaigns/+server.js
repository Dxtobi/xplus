import { json, error } from '@sveltejs/kit';
import { CampaignHelpers, ApiHelpers, PlatformDetector } from '$lib/server/db/models/index';
import { actionTypes } from '$lib/utils/constants.js';

// POST /api/campaigns
export async function POST({ request, locals }) {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  
  try {
    const body = await request.json();
    const campaignData = {
      ...body,
      platform: body.platform || PlatformDetector.detectPlatform(body.link),
      costPerAction:actionTypes.find(a=>a.value===body.actionType).cost||2
    };
    // console.log(campaignData, actionTypes.find(a=>a.value===body.actionType).cost, body )
    
    const campaign = await CampaignHelpers.createCampaign(locals.user._id, campaignData);
    return json(campaign, { status: 201 });
  } catch (err) {
    throw error(400, err.message);
  }
}

// GET /api/campaigns
export async function GET({ url, locals, events }) {
  
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }


  try {
    const page = url.searchParams.get('page') || 1;
    const limit = url.searchParams.get('limit') || 10;
    const status = url.searchParams.get('status');
    
    const result = await ApiHelpers.getUserCampaigns(locals.user._id, page, limit, status);
    return json(result);
  } catch (err) {
    throw error(500, 'Failed to fetch campaigns');
  }
}