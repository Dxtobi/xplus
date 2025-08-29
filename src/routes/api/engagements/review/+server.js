import { json } from '@sveltejs/kit';
import { ApiHelpers } from '$lib/server/db/models/index';

export async function POST({ request, locals }) {
  const user = locals.user;
  if (!user) {
    return json({ message: 'Authentication required' }, { status: 401 });
  }

  const { engagementId, status, reason } = await request.json();

  if (!engagementId || !status) {
    return json({ message: 'Engagement ID and status are required.' }, { status: 400 });
  }

  try {
    const result = await ApiHelpers.reviewEngagements(user.id, engagementId, status, reason);
    return json(result);
  } catch (error) {
    return json({ message: error.message }, { status: 500 });
  }
}