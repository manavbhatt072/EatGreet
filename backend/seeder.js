const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');

dotenv.config();

const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Clear existing data
        await User.deleteMany();
        await Category.deleteMany();
        await MenuItem.deleteMany();

        // Create Super Admin
        const superAdmin = await User.create({
            name: 'Super Admin',
            email: 'admin@eatgreet.com',
            password: 'admin', // In production, use a strong password
            role: 'super-admin'
        });

        // Create Restaurant Admin
        const restaurantAdmin = await User.create({
            name: 'John Doe',
            email: 'admin@gmail.com',
            password: 'admin',
            role: 'admin',
            restaurantName: "John's Kitchen"
        });

        // Create Categories
        const categories = await Category.insertMany([
            { name: 'Breakfast', icon: 'Egg', createdBy: superAdmin._id },
            { name: 'Lunch', icon: 'Utensils', createdBy: superAdmin._id },
            { name: 'Dinner', icon: 'Moon', createdBy: superAdmin._id },
            { name: 'Drinks', icon: 'Coffee', createdBy: superAdmin._id },
            { name: 'Main Course', icon: 'UtensilsCrossed', createdBy: superAdmin._id },
            { name: 'Desserts', icon: 'IceCream', createdBy: superAdmin._id }
        ]);

        // Create Menu Items
        await MenuItem.insertMany([
            {
                name: 'Classic Burger',
                description: 'Juicy beef patty with cheese and lettuce',
                price: 299,
                category: categories[4]._id,
                restaurant: restaurantAdmin._id
            },
            {
                name: 'Pancakes',
                description: 'Fluffy pancakes with maple syrup',
                price: 199,
                category: categories[0]._id,
                restaurant: restaurantAdmin._id
            }
        ]);

        console.log('✅ Data Seeded Successfully!');
        console.log('Categories created:', categories.map(c => c.name).join(', '));
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
