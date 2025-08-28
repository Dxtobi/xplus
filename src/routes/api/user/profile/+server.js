import { json, error } from '@sveltejs/kit';
import { User } from '$lib/server/db/models/index';

// GET /api/user/profile
export async function GET({ locals }) {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const userProfile = await User.findById(locals.user._id).select('-googleId');
    if (!userProfile) {
      throw error(404, 'User not found');
    }
    return json(userProfile);
  } catch (err) {
    throw error(500, 'Server error');
  }
}

// PUT /api/user/profile
export async function PUT({ request, locals }) {
  if (!locals.user) {
    throw error(401, 'Unauthorized');
  }

  try {
    const { name } = await request.json();
    const updatedUser = await User.findByIdAndUpdate(
      locals.user._id,
      { name },
      { new: true, select: '-googleId' }
    );
    return json(updatedUser);
  } catch (err) {
    throw error(500, 'Failed to update profile');
  }
}