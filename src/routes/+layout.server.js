export async function load({ locals }) {
  return {
    user: locals.user ? {
      id: locals.user._id.toString(),
      username: locals.user.username,
      email: locals.user.email,
      avatar: locals.user.avatar,
      totalPoints: locals.user.totalPoints,
      balance:locals.user.balance
    } : null
  };
}