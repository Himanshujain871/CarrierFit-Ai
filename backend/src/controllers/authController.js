const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id || user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET || 'careerfit_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

const mongoose = require('mongoose');

// @desc Register new user
// @route POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, targetJobTitle } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please fill in all required fields (name, email, password).' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const isConnected = mongoose.connection.readyState === 1;

    if (isConnected) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ success: false, message: 'User with this email already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        targetJobTitle: targetJobTitle || 'Full-Stack Software Engineer',
      });

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetJobTitle: user.targetJobTitle,
        },
      });
    } else {
      // Memory fallback if MongoDB is not connected
      console.warn('[Auth Warning]: MongoDB not connected, running in-memory session.');
      const mockId = 'mock_user_' + Date.now();
      const mockUser = { id: mockId, name, email: email.toLowerCase(), targetJobTitle: targetJobTitle || 'Full-Stack Software Engineer' };
      const token = generateToken(mockUser);
      return res.status(201).json({
        success: true,
        message: 'Account registered (in-memory mode).',
        token,
        user: mockUser,
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Registration failed.' });
  }
};

// @desc Authenticate user & get token
// @route POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const isConnected = mongoose.connection.readyState === 1;

    if (isConnected) {
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return res.status(401).json({ success: false, message: 'No account found with this email address.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid password. Please try again.' });
      }

      const token = generateToken(user);
      return res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          targetJobTitle: user.targetJobTitle,
        },
      });
    } else {
      // Memory fallback if Mongo is disconnected
      console.warn('[Auth Warning]: MongoDB not connected, using in-memory demo login.');
      const mockUser = { id: 'mock_user_1', name: 'Demo Candidate', email: email.toLowerCase(), targetJobTitle: 'Senior Full-Stack Engineer' };
      const token = generateToken(mockUser);
      return res.json({
        success: true,
        message: 'Login successful (in-memory mode).',
        token,
        user: mockUser,
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Login failed.' });
  }
};

// @desc Get current user profile
// @route GET /api/auth/me
const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
