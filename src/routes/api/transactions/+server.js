import { json, error } from '@sveltejs/kit';
import { Transaction } from '$lib/server/db/models/index';

// GET /api/transactions
export async function GET({ url, locals }) {
    if (!locals.user) {
        throw error(401, 'Unauthorized');
    }

    try {
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '20');
        const type = url.searchParams.get('type');

        const query = { userId: locals.user._id };
        if (type) {
            query.type = type;
        }

        const transactions = await Transaction.find(query)
            .populate('campaignId', 'title')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)
            .lean();

        const total = await Transaction.countDocuments(query);

        return json({
            transactions,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (err) {
        throw error(500, 'Failed to fetch transactions');
    }
}