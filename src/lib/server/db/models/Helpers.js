import { Types } from 'mongoose';
import { User, Campaign, Engagement, Transaction } from './index.js'; // Import your existing models

// User Profile Model with Campaign Statistics
const UserProfileModel = {
  /**
   * Get comprehensive user profile with campaign and engagement statistics
   * @param {string} userId - User ID
   * @returns {Object} User profile with statistics
   */
  async getUserProfile(userId) {
    try {
      const userObjectId = new Types.ObjectId(userId);
      
      // Get basic user information
      const user = await User.findById(userObjectId)
        .select('-password') // Exclude password for security
        .lean();
      
      if (!user) {
        throw new Error('User not found');
      }

      // Get campaign statistics
      const campaignStats = await Campaign.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: null,
            totalCampaigns: { $sum: 1 },
            activeCampaigns: { 
              $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } 
            },
            completedCampaigns: { 
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } 
            },
            pausedCampaigns: { 
              $sum: { $cond: [{ $eq: ['$status', 'paused'] }, 1, 0] } 
            },
            cancelledCampaigns: { 
              $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } 
            },
            totalSpent: { $sum: '$cost' },
            totalTargetActions: { $sum: '$targetAmount' },
            totalCurrentActions: { $sum: '$currentClicks' },
            averageCostPerAction: { $avg: '$costPerAction' }
          }
        }
      ]);

      // Get platform breakdown for user's campaigns
      const platformBreakdown = await Campaign.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: '$platform',
            count: { $sum: 1 },
            totalSpent: { $sum: '$cost' },
            totalActions: { $sum: '$currentClicks' }
          }
        },
        { $sort: { count: -1 } }
      ]);

      // Get engagement statistics (user participating in other campaigns)
      const engagementStats = await Engagement.aggregate([
        { $match: { userId: userObjectId } },
        {
          $group: {
            _id: null,
            totalEngagements: { $sum: 1 },
            totalEarned: { $sum: '$earnedAmount' },
            uniqueCampaigns: { $addToSet: '$campaignId' }
          }
        }
      ]);

      // Get recent activity (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentActivity = await Campaign.aggregate([
        { 
          $match: { 
            userId: userObjectId,
            createdAt: { $gte: thirtyDaysAgo }
          }
        },
        {
          $group: {
            _id: null,
            recentCampaigns: { $sum: 1 },
            recentSpending: { $sum: '$cost' }
          }
        }
      ]);

      const recentEngagements = await Engagement.countDocuments({
        userId: userObjectId,
        createdAt: { $gte: thirtyDaysAgo }
      });

      // Combine all data
      const profile = {
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          picture: user.picture,
          balance: user.balance,
          totalSpent: user.totalSpent,
          totalEarned: user.totalEarned,
          isActive: user.isActive,
          joinedAt: user.joinedAt,
          lastLogin: user.lastLogin
        },
        campaigns: {
          total: campaignStats[0]?.totalCampaigns || 0,
          active: campaignStats[0]?.activeCampaigns || 0,
          completed: campaignStats[0]?.completedCampaigns || 0,
          paused: campaignStats[0]?.pausedCampaigns || 0,
          cancelled: campaignStats[0]?.cancelledCampaigns || 0,
          totalSpent: campaignStats[0]?.totalSpent || 0,
          totalTargetActions: campaignStats[0]?.totalTargetActions || 0,
          totalCurrentActions: campaignStats[0]?.totalCurrentActions || 0,
          averageCostPerAction: campaignStats[0]?.averageCostPerAction || 0,
          completionRate: campaignStats[0]?.totalCampaigns > 0 
            ? ((campaignStats[0]?.totalCurrentActions || 0) / (campaignStats[0]?.totalTargetActions || 1) * 100).toFixed(2)
            : 0
        },
        engagements: {
          total: engagementStats[0]?.totalEngagements || 0,
          totalEarned: engagementStats[0]?.totalEarned || 0,
          uniqueCampaigns: engagementStats[0]?.uniqueCampaigns?.length || 0
        },
        platformBreakdown,
        recentActivity: {
          campaigns: recentActivity[0]?.recentCampaigns || 0,
          spending: recentActivity[0]?.recentSpending || 0,
          engagements: recentEngagements
        }
      };

      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  /**
   * Get user's campaign summary with status breakdown
   * @param {string} userId - User ID
   * @returns {Object} Campaign summary
   */
  async getUserCampaignSummary(userId) {
    try {
      const userObjectId = new Types.ObjectId(userId);
      
      const summary = await Campaign.aggregate([
        { $match: { userId: userObjectId } },
        {
          $facet: {
            statusBreakdown: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 },
                  totalCost: { $sum: '$cost' },
                  totalActions: { $sum: '$currentClicks' }
                }
              }
            ],
            actionTypeBreakdown: [
              {
                $group: {
                  _id: '$actionType',
                  count: { $sum: 1 },
                  totalCost: { $sum: '$cost' }
                }
              }
            ],
            monthlyTrend: [
              {
                $group: {
                  _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                  },
                  count: { $sum: 1 },
                  spending: { $sum: '$cost' }
                }
              },
              { $sort: { '_id.year': -1, '_id.month': -1 } },
              { $limit: 12 }
            ]
          }
        }
      ]);

      return summary[0];
    } catch (error) {
      console.error('Error fetching campaign summary:', error);
      throw error;
    }
  }
};

// Transaction Model with Filtering and Categorization
const TransactionModel = {
  /**
   * Get user transactions with filtering and categorization
   * @param {string} userId - User ID
   * @param {Object} filters - Filter options
   * @returns {Object} Filtered and categorized transactions
   */
  async getUserTransactions(userId, filters = {}) {
    try {
      const {
        type,
        status,
        startDate,
        endDate,
        page = 1,
        limit = 20,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = filters;

      const userObjectId = new Types.ObjectId(userId);
      
      // Build query
      const query = { userId: userObjectId };
      
      if (type) {
        if (Array.isArray(type)) {
          query.type = { $in: type };
        } else {
          query.type = type;
        }
      }
      
      if (status) {
        if (Array.isArray(status)) {
          query.status = { $in: status };
        } else {
          query.status = status;
        }
      }
      
      // Date range filter
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) {
          query.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          query.createdAt.$lte = new Date(endDate);
        }
      }

      // Get transactions with pagination
      const sortObj = {};
      sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
      
      const transactions = await Transaction.find(query)
        .populate('campaignId', 'title platform actionType')
        .sort(sortObj)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .lean();

      const total = await Transaction.countDocuments(query);

      return {
        transactions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalTransactions: total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1
        }
      };
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      throw error;
    }
  },

  /**
   * Get transaction statistics and breakdown
   * @param {string} userId - User ID
   * @param {Object} filters - Date and other filters
   * @returns {Object} Transaction statistics
   */
  async getTransactionStats(userId, filters = {}) {
    try {
      const { startDate, endDate } = filters;
      const userObjectId = new Types.ObjectId(userId);
      
      const matchQuery = { userId: userObjectId };
      
      // Apply date filter if provided
      if (startDate || endDate) {
        matchQuery.createdAt = {};
        if (startDate) {
          matchQuery.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
          matchQuery.createdAt.$lte = new Date(endDate);
        }
      }

      const stats = await Transaction.aggregate([
        { $match: matchQuery },
        {
          $facet: {
            // By transaction type
            typeBreakdown: [
              {
                $group: {
                  _id: '$type',
                  count: { $sum: 1 },
                  totalAmount: { $sum: '$amount' },
                  averageAmount: { $avg: '$amount' }
                }
              },
              { $sort: { count: -1 } }
            ],
            
            // By status
            statusBreakdown: [
              {
                $group: {
                  _id: '$status',
                  count: { $sum: 1 },
                  totalAmount: { $sum: '$amount' }
                }
              }
            ],
            
            // Monthly trend
            monthlyTrend: [
              {
                $group: {
                  _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    type: '$type'
                  },
                  count: { $sum: 1 },
                  amount: { $sum: '$amount' }
                }
              },
              { $sort: { '_id.year': -1, '_id.month': -1 } }
            ],
            
            // Overall summary
            summary: [
              {
                $group: {
                  _id: null,
                  totalTransactions: { $sum: 1 },
                  totalAmount: { $sum: '$amount' },
                  averageAmount: { $avg: '$amount' },
                  deposits: {
                    $sum: {
                      $cond: [{ $eq: ['$type', 'deposit'] }, '$amount', 0]
                    }
                  },
                  withdrawals: {
                    $sum: {
                      $cond: [{ $eq: ['$type', 'withdrawal'] }, '$amount', 0]
                    }
                  },
                  earnings: {
                    $sum: {
                      $cond: [{ $eq: ['$type', 'engagement_earning'] }, '$amount', 0]
                    }
                  },
                  campaignPayments: {
                    $sum: {
                      $cond: [{ $eq: ['$type', 'campaign_payment'] }, '$amount', 0]
                    }
                  },
                  refunds: {
                    $sum: {
                      $cond: [{ $eq: ['$type', 'refund'] }, '$amount', 0]
                    }
                  }
                }
              }
            ]
          }
        }
      ]);

      return stats[0];
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      throw error;
    }
  },

  /**
   * Get transaction categories with filtering
   * @param {string} userId - User ID
   * @param {Object} filters - Filter options
   * @returns {Object} Categorized transactions
   */
  async getCategorizedTransactions(userId, filters = {}) {
    try {
      const userObjectId = new Types.ObjectId(userId);
      const { startDate, endDate } = filters;
      
      const matchQuery = { userId: userObjectId };
      
      if (startDate || endDate) {
        matchQuery.createdAt = {};
        if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
        if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
      }

      const categorized = await Transaction.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: '$type',
            transactions: {
              $push: {
                id: '$_id',
                amount: '$amount',
                status: '$status',
                description: '$description',
                createdAt: '$createdAt',
                campaignId: '$campaignId',
                paymentMethod: '$paymentMethod'
              }
            },
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' }
          }
        },
        { $sort: { totalAmount: -1 } }
      ]);

      // Format the result
      const result = {
        categories: {},
        summary: {
          totalCategories: categorized.length,
          grandTotal: 0
        }
      };

      categorized.forEach(category => {
        result.categories[category._id] = {
          transactions: category.transactions,
          count: category.count,
          totalAmount: category.totalAmount
        };
        result.summary.grandTotal += category.totalAmount;
      });

      return result;
    } catch (error) {
      console.error('Error fetching categorized transactions:', error);
      throw error;
    }
  },

  /**
   * Get recent transactions
   * @param {string} userId - User ID
   * @param {number} limit - Number of transactions to fetch
   * @returns {Array} Recent transactions
   */
  async getRecentTransactions(userId, limit = 10) {
    try {
      const userObjectId = new Types.ObjectId(userId);
      
      const transactions = await Transaction.find({ userId: userObjectId })
        .populate('campaignId', 'title platform')
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return transactions;
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      throw error;
    }
  }
};

// Export the models
export {
  UserProfileModel,
  TransactionModel
};