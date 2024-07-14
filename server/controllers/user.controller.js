const db = require('../models');
const crypto = require('crypto');
const User = db.user;

const getUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ success: true, usersList: users });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ isAdmin: false });
    return res.status(200).json({ success: true, membersList: members });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    Object.assign(user, updatedData);
    if (updatedData.password) {
      user.setPassword(updatedData.password);
    }
    await user.save();

    return res.status(200).json({ success: true, user });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, deletedUser: user });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.isValidPassword(currentPassword)) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.setPassword(newPassword);
    user.firstLogin = false;
    await user.save();

    return res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const userController = {
  getUser,
  getAllUsers,
  getAllMembers,
  updateUser,
  deleteUser,
  changePassword
};

module.exports = userController;
