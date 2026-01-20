const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get stats for Admin (Restaurant Manager)
router.get('/admin', protect, authorize('admin'), async (req, res) => {
    try {
        const menuCount = await MenuItem.countDocuments({ restaurant: req.user._id });
        const categoryCount = await Category.countDocuments(); // In a multi-tenant app, this would be filtered or global

        // For now, we mock orders/revenue since we don't have an Order model yet
        res.json({
            menuItems: menuCount,
            categories: categoryCount,
            totalOrders: 0,
            revenue: 0,
            activeOrders: 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get stats for Super Admin
router.get('/super-admin', protect, authorize('super-admin'), async (req, res) => {
    try {
        const totalRestaurants = await User.countDocuments({ role: 'admin' });
        const totalCustomers = await User.countDocuments({ role: 'customer' });

        res.json({
            totalRestaurants,
            totalCustomers,
            activeSubscriptions: totalRestaurants, // Mocked
            monthlyRevenue: 0, // Mocked
            unpaidRestaurants: 0 // Mocked
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
