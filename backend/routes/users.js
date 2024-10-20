// routes/users.js
const express = require('express');
const router = express.Router();
const { User } = require('../models/User');  // Import the User model

// POST /api/users/register - Register a new user
router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password, phone, country, streetAddress, city, region, postalCode, notifications } = req.body;

    try {
        // Create a new user object with the data from the request
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            phone,
            country,
            streetAddress,
            city,
            region,
            postalCode,
            notifications
        });

        // Save user to the database
        await newUser.save();

        // Return the newly created user
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error registering user:', error);
        
        // Handle duplicate email error
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
