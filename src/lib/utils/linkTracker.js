import { User, MasterLink, ReferralLink, Click, PointsHistory, MasterLinkLeaderboard } from '$lib/server/db/models/index.js';
import { geoip } from '$lib/utils/geoip.js'; // You'll need to implement this

export class LinkTracker {
  /**
   * Record a click event and award points
   */
  static async recordClick(referralCode, request, locals, deviceId) {
    try {
      // Get client info
      const ipAddress = this.getClientIP(request);
      const userAgent = request.headers.get('user-agent') || '';
      const referrer = request.headers.get('referer') || null;
      // Find the referral link
      const referralLink = await ReferralLink.findOne({ 
        referralCode, 
        isActive: true 
      }).populate('masterLink sharer');
      
      if (!referralLink) {
        throw new Error('Referral link not found or inactive');
      }

      // Check if master link is active and not expired
      const masterLink = referralLink.masterLink;
      if (!masterLink.isActive || (masterLink.expiresAt && masterLink.expiresAt < new Date())) {
        throw new Error('Master link is inactive or expired');
      }

      // Check for unique click (same IP within 24 hours)
      const isUnique = await this.isUniqueClick(referralLink._id, ipAddress, deviceId);
      
     

      // Award points if unique click
      if (isUnique && masterLink.pointsPerClick > 0) {
         // Get location data
        const locationData = await geoip.lookup(ipAddress);
        
        // Create click record
        const click = new Click({
          referralLink: referralLink._id,
          masterLink: masterLink._id,
          sharer: referralLink.sharer._id,
          ipAddress,
          userAgent,
          country: locationData?.country || null,
          city: locationData?.city || null,
          referrer,
          pointsAwarded: isUnique ? masterLink.pointsPerClick : 0,
          isUnique,
          device_id:deviceId,
          clickedAt: new Date()
        });

        await click.save();

        // Update counters
        await this.updateCounters(referralLink, masterLink, isUnique);
        await this.awardPoints(referralLink.sharer, masterLink, referralLink, click);
        return {
        success: true,
        redirectUrl: masterLink.originalUrl,
        pointsAwarded: click.pointsAwarded,
        click: click._id
      };
      }

      return {
        success: true,
        redirectUrl: masterLink.originalUrl,
        pointsAwarded: 0,
        click: 0
      };
      
    } catch (error) {
      console.error('Error recording click:', error);
      throw error;
    }
  }

  /**
   * Check if this is a unique click
   */
  static async isUniqueClick(referralLinkId, ipAddress, deviceId) {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const existingClick = await Click.findOne({
      referralLink: referralLinkId,
      ipAddress,
      device_id:deviceId,
      clickedAt: { $gte: twentyFourHoursAgo }
    });

    return !existingClick;
  }

  /**
   * Update click counters
   */
  static async updateCounters(referralLink, masterLink, isUnique) {
    // Update referral link counters
    await ReferralLink.updateOne(
      { _id: referralLink._id },
      { 
        $inc: { clickCount: 1 },
        $set: { lastClickAt: new Date() }
      }
    );

    // Update master link counters
    await MasterLink.updateOne(
      { _id: masterLink._id },
      { $inc: { totalClicks: 1 } }
    );

    // Update referral link points if unique
    if (isUnique) {
      await ReferralLink.updateOne(
        { _id: referralLink._id },
        { $inc: { pointsEarned: masterLink.pointsPerClick } }
      );
    }
  }

  /**
   * Award points to user
   */
  static async awardPoints(user, masterLink, referralLink, click) {
    const pointsToAward = masterLink.pointsPerClick;
    
    // Update user's total points
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { totalPoints: pointsToAward } },
      { new: true }
    );

    // Create points history record
    const pointsHistory = new PointsHistory({
      user: user._id,
      masterLink: masterLink._id,
      referralLink: referralLink._id,
      click: click._id,
      pointsEarned: pointsToAward,
      previousTotal: updatedUser.totalPoints - pointsToAward,
      newTotal: updatedUser.totalPoints,
      action: 'click',
      description: `Points earned from click on "${masterLink.title}"`
    });

    await pointsHistory.save();

    // Update master link leaderboard
    await this.updateMasterLinkLeaderboard(user._id, masterLink._id, pointsToAward);
  }

  /**
   * Update master link leaderboard
   */
  static async updateMasterLinkLeaderboard(userId, masterLinkId, pointsToAward) {
    await MasterLinkLeaderboard.findOneAndUpdate(
      { user: userId, masterLink: masterLinkId },
      { 
        $inc: { 
          totalPoints: pointsToAward,
          totalClicks: 1
        },
        $set: { lastUpdated: new Date() }
      },
      { upsert: true }
    );
  }

  /**
   * Get client IP address
   */
  static getClientIP(request) {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    if (realIP) {
      return realIP;
    }
    
    return request.connection?.remoteAddress || 'unknown';
  }

  /**
   * Create a referral link for sharing
   */
  static async createReferralLink(masterLinkId, sharerId) {
    try {
      // Check if referral link already exists
      const existingReferral = await ReferralLink.findOne({
        masterLink: masterLinkId,
        sharer: sharerId,
        isActive: true
      });

      if (existingReferral) {
        return existingReferral;
      }

      // Generate unique referral code
      const referralCode = await this.generateReferralCode();

      // Create new referral link
      const referralLink = new ReferralLink({
        referralCode,
        masterLink: masterLinkId,
        sharer: sharerId
      });

      await referralLink.save();

      // Update master link share count
      await MasterLink.updateOne(
        { _id: masterLinkId },
        { $inc: { totalShares: 1 } }
      );

      return referralLink;
    } catch (error) {
      console.error('Error creating referral link:', error);
      throw error;
    }
  }

  /**
   * Generate unique referral code
   */
  static async generateReferralCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code;
    let isUnique = false;

    while (!isUnique) {
      code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      const existing = await ReferralLink.findOne({ referralCode: code });
      isUnique = !existing;
    }

    return code;
  }
}