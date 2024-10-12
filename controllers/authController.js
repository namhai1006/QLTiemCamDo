const PendingUser = require('../models/PendingUser');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new pending user
exports.register = async (req, res) => {
  const { username, password, role, profile } = req.body;

  try {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const pendingUser = new PendingUser({ username, password: hashedPassword, role, profile });
    await pendingUser.save();
    res.status(201).json({ message: 'You have successfully registered. Please wait for an admin to approve your account.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user (pending approval check)
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // First check in Admin and Employee collections
    let user = await Admin.findOne({ username }) || await Employee.findOne({ username });
    
    // Check in pending users if not found in admin/employee
    if (!user) {
      const pendingUser = await PendingUser.findOne({ username });
      if (pendingUser) {
        return res.status(403).json({ message: 'Your account has been registered. Please wait for an admin to review your account.' });
      }
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
