const db = require('../models');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const crypto = require('crypto');
const User = db.user;

const GOOGLE_MAILER_CLIENT_ID = '36928982945-76ujpd23bj9vnctmla2asi7q99sse5d4.apps.googleusercontent.com';
const GOOGLE_MAILER_CLIENT_SECRET = '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';
const GOOGLE_MAILER_REFRESH_TOKEN = '1//04IpvA15YtEuhCgYIARAAGAQSNwF-L9Ir4wtVfdxUEcL8X3oqu5Q6kZw2o1-p1QTaapmJHn8vJgtXEmCQoDBe7s5XgOv8ULTvgnU';
const ADMIN_EMAIL_ADDRESS = 'librarymanagementg5@gmail.com';

const myOAuth2Client = new OAuth2Client(
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET
);

// Set Refresh Token vào OAuth2Client Credentials
myOAuth2Client.setCredentials({
  refresh_token: GOOGLE_MAILER_REFRESH_TOKEN
});

// Fetch access token
async function getAccessToken() {
  const myAccessTokenObject = await myOAuth2Client.getAccessToken();
  return myAccessTokenObject.token;
}

// Configure your SMTP transporter
const createTransporter = async () => {
  const myAccessToken = await getAccessToken();
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: ADMIN_EMAIL_ADDRESS,
      clientId: GOOGLE_MAILER_CLIENT_ID,
      clientSecret: GOOGLE_MAILER_CLIENT_SECRET,
      refreshToken: GOOGLE_MAILER_REFRESH_TOKEN,
      accessToken: myAccessToken
    }
  });
};

const sendWelcomeEmail = async (user, password) => {
  const transporter = await createTransporter();
  const mailOptions = {
    from: ADMIN_EMAIL_ADDRESS,
    to: user.email,
    subject: 'Welcome to Our Service',
    text: `Hello ${user.name},\n\nYour account has been created. Here are your credentials:\n\nUsername: ${user.email}\nPassword: ${password}\n\nBest regards,\nYour Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending email to ${user.email}:`, error);
  }
};

const addUser = async (req, res) => {
  const newUser = req.body;

  try {
    const existingUser = await User.findOne({ email: newUser.email });
    if (existingUser) {
      return res.status(403).json({ success: false, message: 'User already exists' });
    }

    const user = new User(newUser);
    const password = newUser.password || generateRandomPassword();
    user.setPassword(password);
    await user.save();
  
    // Send welcome email
    await sendWelcomeEmail(user, password);

    return res.status(201).json({ success: true, user });
  } catch (err) {
    return res.status(400).json({ success: false, err });
  }
};

const importUsers = async (req, res) => {
  const { users } = req.body;

  try {
    const results = [];

    for (const userData of users) {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        results.push({
          email: userData.email,
          success: false,
          message: 'User already exists',
        });
        continue;
      }

      const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password || generateRandomPassword(),
        dob: userData.dob || null,
        phone: userData.phone || 'N/A',
        photoUrl: userData.photoUrl || 'default-photo-url.png',
        isAdmin: userData.isAdmin || false,
        isLibrarian: userData.isLibrarian || false,
      });

      await newUser.save();

      // Send welcome email
      await sendWelcomeEmail(newUser, newUser.password);

      results.push({ email: userData.email, success: true });
    }

    res.status(200).json({ results });
  } catch (error) {
    console.error('Error importing users:', error);
    res.status(400).json({ success: false, error: 'Error importing users' });
  }
};

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

const generateRandomPassword = () => {
  return crypto.randomBytes(8).toString('hex');
};

const userController = {
  getUser,
  getAllUsers,
  getAllMembers,
  addUser,
  updateUser,
  deleteUser,
  importUsers
};

module.exports = userController;
