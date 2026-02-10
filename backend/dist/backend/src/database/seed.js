"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = __importDefault(require("../config/database"));
const types_1 = require("../../../shared/types");
const seed = async () => {
    const client = await database_1.default.connect();
    try {
        console.log('🌱 Starting seed...');
        // Clear existing data
        await client.query('TRUNCATE TABLE payments, reservations, tables, restaurant_images, restaurants, users CASCADE');
        // Create users
        const passwordHash = await bcryptjs_1.default.hash('password123', 12);
        const users = [
            {
                email: 'admin@example.com',
                password: passwordHash,
                firstName: 'Admin',
                lastName: 'User',
                role: types_1.UserRole.ADMIN,
                phone: '09123456789'
            },
            {
                email: 'vendor@example.com',
                password: passwordHash,
                firstName: 'John',
                lastName: 'Vendor',
                role: types_1.UserRole.VENDOR,
                phone: '09987654321'
            },
            {
                email: 'customer@example.com',
                password: passwordHash,
                firstName: 'Jane',
                lastName: 'Customer',
                role: types_1.UserRole.CUSTOMER,
                phone: '09111111111'
            }
        ];
        const createdUsers = [];
        for (const user of users) {
            const res = await client.query(`INSERT INTO users (email, password_hash, first_name, last_name, role, phone)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`, [user.email, user.password, user.firstName, user.lastName, user.role, user.phone]);
            createdUsers.push(res.rows[0]);
            console.log(`✅ Created user: ${user.email}`);
        }
        const vendor = createdUsers.find(u => u.role === types_1.UserRole.VENDOR);
        // Create Restaurant
        const restaurantRes = await client.query(`INSERT INTO restaurants (
        owner_id, name, description, cuisine, cuisine_type, address, city, zip_code, 
        phone, email, opening_time, closing_time, is_active, rating, total_reviews,
        latitude, longitude
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`, [
            vendor.id,
            'Seaside Delight',
            'Experience the best seafood in Cebu with a view of the ocean.',
            'Seafood',
            'Filipino',
            'SM Seaside City, Cebu',
            'Cebu City',
            '6000',
            '032-123-4567',
            'contact@seasidedelight.com',
            '10:00:00',
            '22:00:00',
            true,
            4.5,
            120,
            10.2829,
            123.8854
        ]);
        const restaurant = restaurantRes.rows[0];
        console.log(`✅ Created restaurant: ${restaurant.name}`);
        // Add Images
        await client.query(`INSERT INTO restaurant_images (restaurant_id, image_url, is_primary)
       VALUES ($1, $2, $3)`, [restaurant.id, 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80', true]);
        console.log('✅ Added restaurant images');
        // Add Tables
        const tables = [
            { number: 'T1', capacity: 2 },
            { number: 'T2', capacity: 2 },
            { number: 'T3', capacity: 4 },
            { number: 'T4', capacity: 4 },
            { number: 'T5', capacity: 6 },
            { number: 'T6', capacity: 8 },
        ];
        for (const table of tables) {
            await client.query(`INSERT INTO tables (restaurant_id, table_number, capacity)
         VALUES ($1, $2, $3)`, [restaurant.id, table.number, table.capacity]);
        }
        console.log(`✅ Created ${tables.length} tables`);
        console.log('✨ Seed completed successfully');
    }
    catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
    finally {
        client.release();
        await database_1.default.end();
    }
};
seed();
//# sourceMappingURL=seed.js.map