import { json, error } from '@sveltejs/kit';
import { Campaign, Transaction } from '$lib/server/db/models/index';

// GET /api/campaigns/:id
export async function GET({ params, locals }) {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }
  
  try {
    const campaign = await Campaign.findOne({
      _id: params.id,
      userId: locals.user._id
    }).populate('userId', 'name picture');
    
    if (!campaign) {
      throw error(404, 'Campaign not found');
    }
    
    return json(campaign);
  } catch (err) {
    throw error(500, 'Failed to fetch campaign');
  }
}

// PUT /api/campaigns/:id
export async function PUT({ request, params, locals }) {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const { status, title, description } = await request.json();
        const campaign = await Campaign.findOneAndUpdate(
            { _id: params.id, userId: locals.user._id },
            { status, title, description },
            { new: true }
        );

        if (!campaign) {
            throw error(404, 'Campaign not found');
        }

        return json(campaign);
    } catch (err) {
        throw error(500, 'Failed to update campaign');
    }
}


// DELETE /api/campaigns/:id
export async function DELETE({ params, locals }) {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const campaign = await Campaign.findOne({
            _id: params.id,
            userId: locals.user._id
        });

        if (!campaign) {
            throw error(404, 'Campaign not found');
        }

        if (campaign.currentClicks > 0) {
            throw error(400, 'Cannot delete campaign with existing engagements');
        }

        const refundTransaction = new Transaction({
            userId: locals.user._id,
            type: 'refund',
            amount: campaign.cost,
            campaignId: campaign._id,
            description: `Refund for cancelled campaign: ${campaign.title}`,
            status: 'completed'
        });

        await refundTransaction.save();
        await User.findByIdAndUpdate(locals.user._id, { $inc: { balance: campaign.cost } });
        await Campaign.findByIdAndDelete(params.id);

        return json({ message: 'Campaign deleted and refunded successfully' });
    } catch (err) {
        throw error(500, 'Failed to delete campaign');
    }
}