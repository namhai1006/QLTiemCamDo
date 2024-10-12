const PendingUser = require('../models/PendingUser');
const Admin = require('../models/Admin');
const Employee = require('../models/Employee');

// Approve pending user
exports.approveUser = async (req, res) => {
  const { id } = req.params;

  try {
    const pendingUser = await PendingUser.findById(id);
    if (!pendingUser) return res.status(404).json({ message: 'User not found' });

    let user;
    if (pendingUser.role === 'admin') {
      user = new Admin({ username: pendingUser.username, password: pendingUser.password, profile: pendingUser.profile });
    } else {
      user = new Employee({ username: pendingUser.username, password: pendingUser.password, profile: pendingUser.profile });
    }

    await user.save();
    await PendingUser.findByIdAndDelete(id);
    res.json({ message: 'User approved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject pending user
exports.rejectUser = async (req, res) => {
  const { id } = req.params;

  try {
    const pendingUser = await PendingUser.findById(id);
    if (!pendingUser) return res.status(404).json({ message: 'User not found' });

    await PendingUser.findByIdAndDelete(id);
    res.json({ message: 'User rejected successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all pending users
exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await PendingUser.find({ status: 'pending' });
    res.json(pendingUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
