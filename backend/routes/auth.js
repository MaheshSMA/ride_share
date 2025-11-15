const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const emailService = require('../services/emailService');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Signup POST
router.post('/signup', async (req, res) => {
  try {
    const { name, username, password, age, gender, mail } = req.body;

    // Validation
    if (!name || !username || !password || !age || !gender || !mail) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ mail: mail.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const user = new User({
      name,
      username: username.toLowerCase(),
      password,
      age: parseInt(age),
      gender,
      mail: mail.toLowerCase(),
      emailVerificationToken: verificationToken,
      isEmailVerified: false
    });

    await user.save();

    // Send verification email
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    await emailService.sendVerificationEmail(user.mail, user.name, verificationUrl);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.mail },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully. Please check your email for verification.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.mail,
        isEmailVerified: user.isEmailVerified,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// Login POST
router.post('/login', async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!mail || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ mail: mail.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.mail },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.mail,
        isEmailVerified: user.isEmailVerified,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

// Email verification route
router.get('/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: 'Invalid verification link' });
    }

    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    if (user.isEmailVerified) {
      return res.json({ message: 'Email already verified' });
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await user.save();

    // Generate JWT token
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.mail },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Email verified successfully',
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.mail,
        isEmailVerified: user.isEmailVerified,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'An error occurred during verification' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password -emailVerificationToken');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Role selection POST
router.post('/role-selection', authenticateToken, async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || (role !== 'captain' && role !== 'customer')) {
      return res.status(400).json({ error: 'Please select a valid role' });
    }

    // Update user role in database
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      message: 'Role selected successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.mail,
        isEmailVerified: user.isEmailVerified,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Role selection error:', error);
    res.status(500).json({ error: 'An error occurred. Please try again.' });
  }
});

module.exports = router;

