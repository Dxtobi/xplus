import { Schema, model, Types } from 'mongoose';
import mongoose from 'mongoose';
// User Schema
const userSchema = new Schema({
    username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: String,
    default: null
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  googleId: {
    type: String,
    required: true,
    unique: true
  },

  username:{
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  picture: {
    type: String,
    default: ''
  },
  balance: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  paystackRecipientCode: { type: String },
  bankName: { type: String },
  accountNumberLast4: { type: String }
}, {
  timestamps: true
});

// Platform enum for validation
const PLATFORMS = [
  'YouTube',
  'Instagram', 
  'TikTok',
  'Twitter/X',
  'Facebook',
  'LinkedIn',
  'Website',
  'Other'
];

// Action type enum
const ACTION_TYPES = [
  'clicks',
  'likes',
  'follows',
  'views',
  'comments',
  'shares'
];

// Campaign/Post Schema
const campaignSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Basic URL validation
        return /^https?:\/\/.+\..+/.test(v);
      },
      message: 'Please enter a valid URL'
    }
  },
  platform: {
    type: String,
    enum: PLATFORMS,
    required: true
  },
  autoDetectedPlatform: {
    type: String,
    enum: PLATFORMS
  },
  actionType: {
    type: String,
    enum: ACTION_TYPES,
    required: true,
    default: 'clicks'
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 100,
    max: 1000000
  },
  currentClicks: {
    type: Number,
    default: 0,
    min: 0
  },
  description: {
    type: String,
    maxlength: 500,
    default: ''
  },
  cost: {
    type: Number,
    required: true,
    min: 0
  },
  costPerAction: {
    type: Number,
    default: 1.1, // 1.1 NGN per action (1100 NGN per 1000 actions)
    min: 0
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    default: function() {
      // Campaign expires after 30 days by default
      return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }
  },
  tags: [{
    type: String,
    maxlength: 50
  }],
  category: {
    type: String,
    enum: ['entertainment', 'education', 'business', 'lifestyle', 'technology', 'other'],
    default: 'other'
  },
  targetAudience: {
    ageRange: {
      min: {
        type: Number,
        min: 13,
        max: 100
      },
      max: {
        type: Number,
        min: 13,
        max: 100
      }
    },
    location: [{
      type: String
    }],
    interests: [{
      type: String
    }]
  },
  analytics: {
    uniqueUsers: {
      type: Number,
      default: 0
    },
    repeatActions: {
      type: Number,
      default: 0
    },
    conversionRate: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Engagement/Click Schema - Track individual user interactions
const engagementSchema = new Schema({
 proofUsername: { 
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionType: {
    type: String,
    enum: ACTION_TYPES,
    required: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  referrer: {
    type: String,
    default: ''
  },
  location: {
    country: String,
    city: String,
    region: String
  },
  deviceInfo: {
    type: String,
    default: 'unknown'
  },
  isValid: {
    type: Boolean,
    default: true
  },
  earnedAmount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Transaction Schema - Track financial transactions
const transactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'campaign_payment', 'engagement_earning', 'refund'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  campaignId: {
    type: Schema.Types.ObjectId,
    ref: 'Campaign'
  },
  engagementId: {
    type: Schema.Types.ObjectId,
    ref: 'Engagement'
  },
  description: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['paystack', 'flutterwave', 'bank_transfer', 'wallet'],
    default: 'wallet'
  },
  externalTransactionId: {
    type: String
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Analytics Schema - Track platform-wide analytics
const analyticsSchema = new Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  totalUsers: {
    type: Number,
    default: 0
  },
  activeUsers: {
    type: Number,
    default: 0
  },
  totalCampaigns: {
    type: Number,
    default: 0
  },
  activeCampaigns: {
    type: Number,
    default: 0
  },
  totalEngagements: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  },
  platformBreakdown: {
    YouTube: { type: Number, default: 0 },
    Instagram: { type: Number, default: 0 },
    TikTok: { type: Number, default: 0 },
    'Twitter/X': { type: Number, default: 0 },
    Facebook: { type: Number, default: 0 },
    LinkedIn: { type: Number, default: 0 },
    Website: { type: Number, default: 0 },
    Other: { type: Number, default: 0 }
  },
  actionTypeBreakdown: {
    clicks: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    follows: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

campaignSchema.index({ userId: 1, status: 1 });
campaignSchema.index({ platform: 1, actionType: 1 });
campaignSchema.index({ createdAt: -1 });
campaignSchema.index({ expiresAt: 1 });

engagementSchema.index({ campaignId: 1, userId: 1 });
engagementSchema.index({ userId: 1 });
engagementSchema.index({ createdAt: -1 });
engagementSchema.index({ ipAddress: 1, campaignId: 1 }); // Prevent spam

transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

analyticsSchema.index({ date: -1 });

// Middleware

// Auto-detect platform before saving campaign
campaignSchema.pre('save', function(next) {
  if (this.link && !this.platform) {
    try {
      const url = new URL(this.link);
      const domain = url.hostname.toLowerCase();
      
      if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
        this.platform = 'YouTube';
      } else if (domain.includes('instagram.com')) {
        this.platform = 'Instagram';
      } else if (domain.includes('tiktok.com')) {
        this.platform = 'TikTok';
      } else if (domain.includes('twitter.com') || domain.includes('x.com')) {
        this.platform = 'Twitter/X';
      } else if (domain.includes('facebook.com') || domain.includes('fb.com')) {
        this.platform = 'Facebook';
      } else if (domain.includes('linkedin.com')) {
        this.platform = 'LinkedIn';
      } else {
        this.platform = 'Website';
      }
      
      this.autoDetectedPlatform = this.platform;
    } catch (error) {
      this.platform = 'Other';
    }
  }
  
  // Calculate cost
  this.cost = (this.targetAmount / 1000) * (this.costPerAction * 1000);
  
  // Check if campaign is completed
  if (this.currentClicks >= this.targetAmount && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
    this.status = 'completed';
  }
  
  next();
});

// Update user balance after transaction
// Update user balance after transaction
transactionSchema.post('save', async function(doc) {
  // We only want to run this logic when a transaction is first marked as 'completed'.
  // We check if the 'status' field was modified to prevent this from running on other updates.
  
  if (doc.status === 'completed') {
    
    const User = mongoose.model('User'); // Use mongoose.model() to avoid import issues
    const user = await User.findById(doc.userId);
    
    if (user) {
      // Determine the amount to credit/debit.
      // Use the base_amount from metadata if it exists, otherwise use the transaction's total amount.
      const amountToCredit = doc.metadata?.base_amount || doc.amount;

      if (doc.type === 'deposit' || doc.type === 'engagement_earning' || doc.type === 'refund') {
        user.balance += amountToCredit;
        if (doc.type === 'engagement_earning') {
          user.totalEarned += amountToCredit;
        }
      } else if (doc.type === 'withdrawal' || doc.type === 'campaign_payment') {
        // For campaign payments, you likely want to deduct the full amount (including any fees you might add).
        // But for consistency with deposits, we can use the base amount here too. Adjust as needed.
        user.balance -= amountToCredit;
        if (doc.type === 'campaign_payment') {
          user.totalSpent += amountToCredit;
        }
      }
      
      try {
        await user.save();
      } catch (error) {
        console.error(`Failed to update user balance for user ${user._id}`, error);
        // Decide how to handle this error. Maybe log it to a separate error tracking service.
      }
    }
  }

});

// Create models
const User = model('User', userSchema);
const Campaign = model('Campaign', campaignSchema);
const Engagement = model('Engagement', engagementSchema);
const Transaction = model('Transaction', transactionSchema);
const Analytics = model('Analytics', analyticsSchema);

// Utility functions
const PlatformDetector = {
  detectPlatform(url) {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      
      const platformMap = {
        'youtube.com': 'YouTube',
        'youtu.be': 'YouTube',
        'instagram.com': 'Instagram',
        'tiktok.com': 'TikTok',
        'twitter.com': 'Twitter/X',
        'x.com': 'Twitter/X',
        'facebook.com': 'Facebook',
        'fb.com': 'Facebook',
        'linkedin.com': 'LinkedIn'
      };
      
      // Check for exact matches first
      if (platformMap[domain]) {
        return platformMap[domain];
      }
      
      // Check for partial matches
      for (const [key, value] of Object.entries(platformMap)) {
        if (domain.includes(key.split('.')[0])) {
          return value;
        }
      }
      
      return 'Website';
    } catch (error) {
      return 'Other';
    }
  },
  
  getPlatformEmoji(platform) {
    const emojiMap = {
      'YouTube': '📺',
      'Instagram': '📸',
      'TikTok': '🎵',
      'Twitter/X': '🐦',
      'Facebook': '👥',
      'LinkedIn': '💼',
      'Website': '🌐',
      'Other': '🔗'
    };
    return emojiMap[platform] || '🔗';
  }
};

// Campaign helper functions
const CampaignHelpers = {
  calculateCost(targetActions, costPerAction = 1.1) {
    return (targetActions / 1000) * (costPerAction * 1000);
  },
  
  async createCampaign(userId, campaignData) {
    const User = model('User');
    const Campaign = model('Campaign');
    const Transaction = model('Transaction');
    
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    
    const cost = this.calculateCost(campaignData.targetAmount, campaignData.costPerAction);
    
    if (user.balance < cost) {
      throw new Error('Insufficient balance');
    }
    
    // Create campaign
    const campaign = new Campaign({
      ...campaignData,
      userId,
      cost,
      platform: campaignData.platform || PlatformDetector.detectPlatform(campaignData.link)
    });
    
    await campaign.save();
    
    // Create transaction
    const transaction = new Transaction({
      userId,
      type: 'campaign_payment',
      amount: cost,
      campaignId: campaign._id,
      description: `Payment for campaign: ${campaign.title}`,
      status: 'completed'
    });
    
    await transaction.save();
    
    return campaign;
  },
  
  async recordEngagement(campaignId, userId, engagementData, proofUsername) {
    const Campaign = model('Campaign');
    const Engagement = model('Engagement');
    const Transaction = model('Transaction');
    const User = model('User');
    
    const campaign = await Campaign.findById(campaignId);
    if (!campaign || campaign.status !== 'active') {
      throw new Error('Campaign not available');
    }
    
    if (campaign.currentClicks >= campaign.targetAmount) {
      throw new Error('Campaign target already reached');
    }
    
    // Check if user already engaged (prevent spam)
    const existingEngagement = await Engagement.findOne({
      campaignId,
      userId,
      ipAddress: engagementData.ipAddress,
      proofUsername:proofUsername,
    });
    
    if (existingEngagement) {
      throw new Error('User already engaged with this campaign');
    }
    
    // Record engagement
    const engagement = new Engagement({
      campaignId,
      userId,
      actionType: campaign.actionType,
      ...engagementData,
      earnedAmount:campaign.costPerAction||3 ,
      proofUsername:proofUsername,
    });
    
    await engagement.save();
    
    // Update campaign
    campaign.currentClicks += 1;
    campaign.analytics.uniqueUsers += 1;
    await campaign.save();
    
    // Create earning transaction for user
    const transaction = new Transaction({
      userId,
      type: 'engagement_earning',
      amount: campaign.costPerAction||3,
      campaignId,
      engagementId: engagement._id,
      description: `Earned from ${campaign.actionType}`,
      status: 'pending'
    });
    
    await transaction.save();
    
    return engagement;
  }
};

// API Routes Helper Functions
const ApiHelpers = {
  // Get user campaigns with pagination
  async getUserCampaigns(userId, page = 1, limit = 10, status = null) {
    const Campaign = model('Campaign');
    const query = { userId };
    
    if (status) {
      query.status = status;
    }
    
    const campaigns = await Campaign.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    const total = await Campaign.countDocuments(query);
    
    return {
      campaigns,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    };
  },
    
    // Get available campaigns for engagement
    async getAvailableCampaigns(userId, page = 1, limit = 20, filters = {}) {
    const Campaign = model('Campaign');
    const Engagement = model('Engagement');
    
    // Don't show user's own campaigns
    const query = { 
      userId: { $ne: userId },
      status: 'active',
      isCompleted: false,
      expiresAt: { $gt: new Date() }
    };
    
    // Apply filters
    if (filters.platform) {
      query.platform = filters.platform;
    }
    
    if (filters.actionType) {
      query.actionType = filters.actionType;
    }
    
    if (filters.category) {
      query.category = filters.category;
    }
    
    // Get campaigns user hasn't engaged with
    const userEngagements = await Engagement.find({ userId }).distinct('campaignId');
    query._id = { $nin: userEngagements };
    
    const campaigns = await Campaign.find(query)
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    const total = await Campaign.countDocuments(query);
    
    return {
      campaigns,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    };
    },
    
    // Get user analytics
    async getUserAnalytics(userId) {
    const Campaign = model('Campaign');
    const Engagement = model('Engagement');
    const Transaction = model('Transaction');
    
    const [campaignStats, engagementStats, transactionStats] = await Promise.all([
      Campaign.aggregate([
      { $match: { userId: Types.ObjectId(userId) } },
      {
        $group: {
        _id: null,
        totalCampaigns: { $sum: 1 },
        activeCampaigns: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        completedCampaigns: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        totalSpent: { $sum: '$cost' },
        totalClicks: { $sum: '$currentClicks' }
        }
      }
      ]),
      Engagement.countDocuments({ userId }),
      Transaction.aggregate([
      { $match: { userId: Types.ObjectId(userId) } },
      {
        $group: {
        _id: '$type',
            total: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ])
    ]);
    
    return {
      campaigns: campaignStats[0] || {},
      totalEngagements: engagementStats,
      transactions: transactionStats
    };
  },

   /**
   * For CREATORS: Gets a paginated list of pending engagements for their campaigns.
   * This is the data source for the "Review Submissions" page.
   * @param {string} creatorId - The ID of the user who created the campaigns.
   * @param {number} [page=1] - The page number for pagination.
   * @param {number} [limit=10] - The number of items per page.
   * @returns {Promise<object>} - A paginated list of pending engagements.
   */
  async getPendingEngagementsForCreator(creatorId, page = 1, limit = 10) {
    const Engagement = model('Engagement');
    const creatorObjectId = new Types.ObjectId(creatorId);

    // Pipeline for fetching paginated engagements
    const engagementsPipeline = [
      {
        $lookup: {
          from: 'campaigns',
          localField: 'campaignId',
          foreignField: '_id',
          as: 'campaign'
        }
      },
      {
        $unwind: { path: '$campaign', preserveNullAndEmptyArrays: true }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'earner'
        }
      },
      {
        $unwind: { path: '$earner', preserveNullAndEmptyArrays: true }
      },
      {
        $match: {
          'campaign.userId': creatorObjectId,
          status: 'pending'
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      },
      {
        $addFields: {
          campaignId: '$campaign',
          userId: '$earner'
        }
      },
      {
        $project: {
          campaign: 0,
          earner: 0
        }
      }
    ];

    // Pipeline for counting total matching documents
    const countPipeline = [
      {
        $lookup: {
          from: 'campaigns',
          localField: 'campaignId',
          foreignField: '_id',
          as: 'campaign'
        }
      },
      {
        $unwind: { path: '$campaign', preserveNullAndEmptyArrays: true }
      },
      {
        $match: {
          'campaign.userId': creatorObjectId,
          status: 'pending'
        }
      },
      {
        $count: "totalCount"
      }
    ];

    try {
      const engagementsPromise = Engagement.aggregate(engagementsPipeline);
      const totalResultPromise = Engagement.aggregate(countPipeline);

      const [engagements, totalResult] = await Promise.all([engagementsPromise, totalResultPromise]);

      const total = totalResult.length > 0 ? totalResult[0].totalCount : 0;

      // After fetching, map over the results to add the constructed link.
      const engagementsWithProofLinks = engagements.map(eng => {
        let proofLink = '#'; // Default fallback
        const platform = eng.campaignId?.platform; // Use optional chaining for safety
        const username = eng.proofUsername ? eng.proofUsername.replace('@', '') : ''; // Sanitize username, check if proofUsername exists

        if (platform === 'Twitter/X') {
          proofLink = `https://x.com/${username}`;
        } else if (platform === 'Instagram') {
          proofLink = `https://instagram.com/${username}`;
        } else if (platform === 'TikTok') {
          proofLink = `https://tiktok.com/@${username}`;
        }
        // Add other platforms as needed...

        return {
          ...eng,
          proofLink // Add the new property to the object
        };
      });

      return {
        engagements: engagementsWithProofLinks,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      };
    } catch (error) {
      console.error("Error in getPendingEngagementsForCreator:", error);
      // Re-throw or handle error appropriately
      throw error;
    }
  },

  /**
   * For CREATORS: Approves or rejects a submitted engagement.
   * This is a transactional operation to ensure data integrity.
   * @param {string} creatorId - The ID of the user performing the review (for security).
   * @param {string} engagementId - The ID of the engagement to review.
   * @param {'approved' | 'rejected'} newStatus - The new status.
   * @param {string} [rejectionReason] - An optional reason if rejecting.
   * @returns {Promise<Engagement>} - The updated engagement document.
   */
  async reviewEngagements(creatorId, engagementIds, newStatus, rejectionReason = '') {
    const session = await mongoose.startSession();
    session.startTransaction();

   
    try {
      const Engagement = model('Engagement');
      const Campaign = model('Campaign');
      const Transaction = model('Transaction');

      // Find all engagements by IDs
      const engagements = await Engagement.find({ _id: { $in: engagementIds } }).session(session);

      if (!engagements.length) {
        throw new Error('No engagements found.');
      }

      // Security & Validation: All must belong to creator and be pending
      for (const engagement of engagements) {
        // Find campaign to check creator
        const campaign = await Campaign.findById(engagement.campaignId).session(session);
        if (!campaign) throw new Error('Associated campaign not found.');
        if (campaign.userId.toString() !== creatorId) {
          throw new Error('You are not authorized to review this submission.');
        }
        if (engagement.status !== 'pending') {
          throw new Error('One or more submissions have already been reviewed.');
        }
      }

      // Process each engagement
      for (const engagement of engagements) {
        const campaign = await Campaign.findById(engagement.campaignId).session(session);

        if (newStatus === 'approved') {
          engagement.status = 'approved';

          // Create or update earning transaction
          let earningTransaction = await Transaction.findOne({
            campaignId: campaign._id,
            userId: engagement.userId,
            engagementId: engagement._id,
            type: 'engagement_earning'
          }).session(session);

          const amountToPay = engagement.earnedAmount || campaign.costPerAction || 0;

          if (earningTransaction) {
            earningTransaction.amount = amountToPay;
            earningTransaction.status = 'completed';
            earningTransaction.description = `Earning from "${campaign.title}"`;
            earningTransaction.paymentMethod = 'wallet';
          } else {
            earningTransaction = new Transaction({
              userId: engagement.userId,
              type: 'engagement_earning',
              amount: amountToPay,
              status: 'completed',
              campaignId: campaign._id,
              engagementId: engagement._id,
              description: `Earning from "${campaign.title}"`,
              paymentMethod: 'wallet'
            });
          }
          await earningTransaction.save({ session });

          // Increment campaign progress
          campaign.currentClicks += 1;
          if (campaign.currentClicks >= campaign.targetAmount) {
            campaign.status = 'completed';
            campaign.isCompleted = true;
            campaign.completedAt = new Date();
          }
          await campaign.save({ session });

        } else if (newStatus === 'rejected') {
          engagement.status = 'rejected';
          if (rejectionReason) {
            engagement.rejectionReason = rejectionReason;
          }
        } else {
          throw new Error('Invalid review status provided.');
        }

        await engagement.save({ session });
      }

      await session.commitTransaction();
      return engagements;

    } catch (error) {
      await session.abortTransaction();
      console.error("Review Engagements Transaction Error:", error);
      throw error;
    } finally {
      session.endSession();
    }
  },

  /**
   * For EARNERS: Gets their own history of submitted engagements.
   * This is the data source for a "My Submissions" page.
   * @param {string} earnerId - The ID of the user checking their submissions.
   * @param {number} [page=1] - The page number for pagination.
   * @param {number} [limit=10] - The number of items per page.
   * @param {string} [status] - Optional filter by status ('pending', 'approved', 'rejected').
   * @returns {Promise<object>} - A paginated list of the user's engagements.
   */
  async getEngagementHistoryForEarner(earnerId, page = 1, limit = 10, status = null) {
    const Engagement = model('Engagement');
    
    const query = {
      userId: new Types.ObjectId(earnerId)
    };
    
    if (status && ['pending', 'approved', 'rejected'].includes(status)) {
      query.status = status;
    }

    const engagements = await Engagement.find(query)
      .populate('campaignId', 'title platform') // Populate campaign info
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();
      
    const total = await Engagement.countDocuments(query);

    return {
      engagements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    };
  }


};

// Export models and utilities
export {
  User,
  Campaign,
  Engagement,
  Transaction,
  Analytics,
  PlatformDetector,
  CampaignHelpers,
  ApiHelpers,
  PLATFORMS,
  ACTION_TYPES
};