// backend/controllers/adminController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// ==================== AUTHENTICATION ====================
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        // For now, compare plain text (later use bcrypt)
        if (password !== user.password) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            success: true,
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// ==================== CAR MANAGEMENT ====================
const addCar = async (req, res) => {
    try {
        const {
            name, brand, model, year, price, discountPrice,
            color, description, fuelType, transmission,
            mileage, engine, horsepower
        } = req.body;
        
        const images = req.files;
        
        if (!name || !brand || !price) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, brand and price are required' 
            });
        }
        
        const [result] = await db.execute(
            `INSERT INTO cars 
            (name, brand, model, year, price, discount_price, color, 
             description, fuel_type, transmission, mileage, engine, horsepower) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, brand, model || null, year || null, price, discountPrice || price, color || null,
             description || null, fuelType || 'Petrol', transmission || 'Automatic', 
             mileage || null, engine || null, horsepower || null]
        );
        
        if (images && images.length > 0) {
            for (let image of images) {
                await db.execute(
                    'INSERT INTO car_images (car_id, image_url) VALUES (?, ?)',
                    [result.insertId, `/uploads/${image.filename}`]
                );
            }
        }
        
        res.status(201).json({ 
            success: true, 
            message: 'Car added successfully',
            carId: result.insertId 
        });
    } catch (error) {
        console.error('Error in addCar:', error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};

// backend/controllers/adminController.js
const getAllCars = async (req, res) => {
    try {
        console.log('Fetching all cars...'); // للتأكد من وصول الطلب
        
        const [cars] = await db.execute(`
            SELECT 
                c.id,
                c.name,
                c.brand,
                c.model,
                c.year,
                c.price,
                c.discount_price,
                c.color,
                c.description,
                c.fuel_type,
                c.transmission,
                c.mileage,
                c.engine,
                c.horsepower,
                c.created_at,
                GROUP_CONCAT(ci.image_url) as images
            FROM cars c
            LEFT JOIN car_images ci ON c.id = ci.car_id
            GROUP BY c.id
            ORDER BY c.created_at DESC
        `);
        
        console.log('Cars found:', cars.length); // للتأكد
        
        // معالجة الصور
        const carsWithImages = cars.map(car => ({
            ...car,
            images: car.images ? car.images.split(',') : []
        }));
        
        res.json({ 
            success: true, 
            cars: carsWithImages 
        });
    } catch (error) {
        console.error('Error in getAllCars:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message 
        });
    }
};

const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [cars] = await db.execute(`
            SELECT c.*, GROUP_CONCAT(ci.image_url) as images
            FROM cars c
            LEFT JOIN car_images ci ON c.id = ci.car_id
            WHERE c.id = ?
            GROUP BY c.id
        `, [id]);
        
        if (cars.length === 0) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }
        
        const car = {
            ...cars[0],
            images: cars[0].images ? cars[0].images.split(',') : []
        };
        
        res.json({ success: true, car });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, brand, model, year, price, discountPrice,
            color, description, fuelType, transmission,
            mileage, engine, horsepower
        } = req.body;
        
        const [existing] = await db.execute('SELECT id FROM cars WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }
        
        await db.execute(
            `UPDATE cars SET 
                name = ?, brand = ?, model = ?, year = ?, 
                price = ?, discount_price = ?, color = ?, 
                description = ?, fuel_type = ?, transmission = ?, 
                mileage = ?, engine = ?, horsepower = ?
            WHERE id = ?`,
            [name, brand, model, year, price, discountPrice, color,
             description, fuelType, transmission, mileage, engine, horsepower, id]
        );
        
        res.json({ success: true, message: 'Car updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [existing] = await db.execute('SELECT id FROM cars WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: 'Car not found' });
        }
        
        const [images] = await db.execute('SELECT image_url FROM car_images WHERE car_id = ?', [id]);
        
        for (let image of images) {
            const imagePath = path.join(__dirname, '..', image.image_url);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }
        
        await db.execute('DELETE FROM cars WHERE id = ?', [id]);
        
        res.json({ success: true, message: 'Car deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Export all functions
module.exports = {
    adminLogin,
    addCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar
};