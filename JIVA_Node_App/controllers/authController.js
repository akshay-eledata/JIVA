const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, firstName, lastName, phone, email, password, twoFactorEnabled } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prefer an explicit first/last name; fall back to `name`, then the email.
    const fullName = [firstName, lastName].filter(Boolean).join(' ').trim()
      || name || (email ? email.split('@')[0] : 'User');

    const user = await User.create({
      name: fullName,
      firstName: firstName || null,
      lastName: lastName || null,
      phone: phone || null,
      email,
      password: hashedPassword,
      // Two factor only makes sense if we actually have a number to text.
      twoFactorEnabled: Boolean(twoFactorEnabled && phone)
    });

    const token = generateToken(user.id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      email: user.email,
      twoFactorEnabled: user.twoFactorEnabled,
      token: token // Keep it in JSON too just in case existing logic relies on it temporarily
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user.id);
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
      });

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: token // Keep it in JSON too
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm the SMS code for two factor setup
// @route   POST /api/auth/verify-phone
// @access  Private
//
// Demo build: no SMS provider is wired up yet, so any six digit code is
// accepted. Swap the check below for a real provider lookup when we connect
// one and the rest of the flow stays the same.
const verifyPhone = async (req, res) => {
  const { code } = req.body;

  if (!/^\d{6}$/.test(String(code || ''))) {
    return res.status(400).json({ message: 'Enter the six digit code we sent you.' });
  }

  try {
    await User.update(
      { phoneVerified: true },
      { where: { id: req.user.id } }
    );
    res.json({ phoneVerified: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, verifyPhone };
