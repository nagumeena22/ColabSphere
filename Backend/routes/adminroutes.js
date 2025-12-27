const express = require('express');

const User = require('../models/userSchema');
const Project = require('../models/ProjectSchema');
const { authenticateToken } = require('../middleware/AuthMiddleware');
const router = express.Router();
const JoinRequest = require('../models/joinRequestSchema');

/* ================= ADMIN ONLY MIDDLEWARE ================= */

const adminOnly = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access only' });
        }

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


router.get("/me", authenticateToken, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});






router.get('/users', authenticateToken, adminOnly, async (req, res) => {
    try {
        const { role } = req.query;

        const filter = role ? { role } : {};
        const users = await User.find(filter).select('-password');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all join requests with user and project details (accessible to all authenticated users)
router.get('/join-requests', authenticateToken, async (req, res) => {
    try {
        const joinRequests = await JoinRequest.find()
            .populate('userId', 'name email department regNo')
            .populate('projectId', 'adminName department branch domain projectDescription startDate endDate')
            .sort({ requestedAt: -1 });

        res.status(200).json(joinRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update join request status (accept/reject) - accessible to all authenticated users
router.put('/join-requests/:requestId', authenticateToken, async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status, message } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Must be accepted or rejected' });
        }

        const updateData = { 
            status, 
            respondedAt: new Date() 
        };

        if (message) {
            updateData.responseMessage = message;
        }

        const joinRequest = await JoinRequest.findByIdAndUpdate(
            requestId,
            updateData,
            { new: true }
        ).populate('userId', 'name email').populate('projectId', 'adminName projectDescription');

        if (!joinRequest) {
            return res.status(404).json({ message: 'Join request not found' });
        }

        res.status(200).json({ 
            message: `Join request ${status}`, 
            joinRequest 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get collaboration insights and analytics
router.get('/insights', authenticateToken, async (req, res) => {
    try {
        // Get join request statistics
        const totalRequests = await JoinRequest.countDocuments();
        const pendingRequests = await JoinRequest.countDocuments({ status: 'pending' });
        const acceptedRequests = await JoinRequest.countDocuments({ status: 'accepted' });
        const rejectedRequests = await JoinRequest.countDocuments({ status: 'rejected' });

        // Get project-wise statistics (simplified with error handling)
        let projectStats = [];
        try {
            projectStats = await JoinRequest.aggregate([
                {
                    $group: {
                        _id: '$projectId',
                        total: { $sum: 1 },
                        accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
                        rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
                        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } }
                    }
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'project'
                    }
                },
                { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        projectName: { $ifNull: ['$project.adminName', 'Unknown Project'] },
                        department: { $ifNull: ['$project.department', 'Unknown'] },
                        domain: { $ifNull: ['$project.domain', 'Unknown'] },
                        total: 1,
                        accepted: 1,
                        rejected: 1,
                        pending: 1,
                        acceptanceRate: {
                            $cond: {
                                if: { $eq: ['$total', 0] },
                                then: 0,
                                else: { $multiply: [{ $divide: ['$accepted', '$total'] }, 100] }
                            }
                        }
                    }
                },
                { $sort: { total: -1 } },
                { $limit: 10 }
            ]);
        } catch (aggError) {
            console.error('Error in projectStats aggregation:', aggError);
            projectStats = [];
        }

        // Get top collaborators (simplified with error handling)
        let topCollaborators = [];
        try {
            topCollaborators = await JoinRequest.aggregate([
                { $match: { status: 'accepted' } },
                {
                    $group: {
                        _id: '$userId',
                        acceptedCount: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        name: { $ifNull: ['$user.name', 'Unknown User'] },
                        email: { $ifNull: ['$user.email', ''] },
                        department: { $ifNull: ['$user.department', 'Unknown'] },
                        regNo: { $ifNull: ['$user.regNo', ''] },
                        acceptedCount: 1
                    }
                },
                { $sort: { acceptedCount: -1 } },
                { $limit: 10 }
            ]);
        } catch (aggError) {
            console.error('Error in topCollaborators aggregation:', aggError);
            topCollaborators = [];
        }

        // Get day-wise collaboration data for the last 30 days (simplified)
        let dayWiseData = [];
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            dayWiseData = await JoinRequest.aggregate([
                { $match: { requestedAt: { $gte: thirtyDaysAgo } } },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: '%Y-%m-%d', date: '$requestedAt' }
                        },
                        total: { $sum: 1 },
                        accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
                        rejected: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
                        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } }
                    }
                },
                { $sort: { '_id': 1 } }
            ]);
        } catch (aggError) {
            console.error('Error in dayWiseData aggregation:', aggError);
            dayWiseData = [];
        }

        // Get projects with highest acceptance ratio (simplified)
        let highestAcceptanceRatio = [];
        try {
            highestAcceptanceRatio = await JoinRequest.aggregate([
                {
                    $group: {
                        _id: '$projectId',
                        total: { $sum: 1 },
                        accepted: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } }
                    }
                },
                {
                    $match: { total: { $gte: 1 } } // At least 1 application
                },
                {
                    $lookup: {
                        from: 'projects',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'project'
                    }
                },
                { $unwind: { path: '$project', preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        projectName: { $ifNull: ['$project.adminName', 'Unknown Project'] },
                        department: { $ifNull: ['$project.department', 'Unknown'] },
                        domain: { $ifNull: ['$project.domain', 'Unknown'] },
                        total: 1,
                        accepted: 1,
                        acceptanceRate: {
                            $cond: {
                                if: { $eq: ['$total', 0] },
                                then: 0,
                                else: { $multiply: [{ $divide: ['$accepted', '$total'] }, 100] }
                            }
                        }
                    }
                },
                { $sort: { acceptanceRate: -1 } },
                { $limit: 10 }
            ]);
        } catch (aggError) {
            console.error('Error in highestAcceptanceRatio aggregation:', aggError);
            highestAcceptanceRatio = [];
        }

        res.status(200).json({
            overview: {
                totalRequests,
                pendingRequests,
                acceptedRequests,
                rejectedRequests
            },
            projectStats,
            topCollaborators,
            dayWiseData,
            highestAcceptanceRatio
        });
    } catch (error) {
        console.error('Error fetching insights:', error);
        res.status(500).json({ message: error.message });
    }
});

// Save user settings
router.put('/settings', authenticateToken, async (req, res) => {
    try {
        const { settings } = req.body;
        const userId = req.userId;

        // Update user with settings
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                settings: settings,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'Settings saved successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error saving settings:', error);
        res.status(500).json({ message: error.message });
    }
});

// Export user data
router.get('/export-data', authenticateToken, async (req, res) => {
    try {
        const userId = req.userId;

        // Get user profile
        const user = await User.findById(userId).select('-password');

        // Get user's projects
        const projects = await Project.find({ adminId: userId });

        // Get user's join requests
        const joinRequests = await JoinRequest.find({ userId: userId })
            .populate('projectId', 'adminName department branch domain projectDescription startDate endDate')
            .sort({ requestedAt: -1 });

        const exportData = {
            user: user,
            projects: projects,
            joinRequests: joinRequests,
            exportedAt: new Date(),
            version: '1.0'
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="colabsphere-data.json"');
        res.status(200).json(exportData);
    } catch (error) {
        console.error('Error exporting data:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;