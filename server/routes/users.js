//const db = require('../db');
const { getDB } = require('../db.js');
const bcrypt = require('bcryptjs');

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// User Registration
router.post('/register', [
  // password must be at least 8 chars long
  body('password').isLength({ min: 8 }),
  // email must be an email
  body('email').isEmail(),
  // role must be one of the defined roles
  body('role').isIn(['Admin', 'Manager', 'User'])
], async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // if validation passed, create a new user
  let newUser = req.body;
  const { email, password } = newUser;

  try {
    const db = getDB();
    // Check if a user already exists with the given email
    const existingUser = await db.collection('Users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // Hash password before saving user
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    const result = await db.collection('Users').insertOne(newUser);
    console.log(result); // This will log the result

    // If insert is successful, fetch the user
    if (result.insertedId) {
      const insertedUser = await db.collection('Users').findOne({_id: result.insertedId});
      // Remove password field before sending user data
      delete insertedUser.password;
      res.status(201).send(insertedUser); 
    } else {
      res.status(500).send('Error inserting user');
    }
  } catch (error) {
    console.log('Database error:', error);
    res.status(500).send(error);
  }
});  
// User Login
router.post('/login', (req, res) => {
  res.send('User SignIn');
});
router.post(
  '/signin',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const db = getDB();
      const user = await db.collection('Users').findOne({ email });

      if (!user) {
        console.log('User not found');
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log('Password does not match');
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      console.log('Found user:', user);
      res.send('User SignIn');
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).send('Server error');
    }
  }
);

// Get User Profile
router.get('/profile', (req, res) => {
    res.send('Get User Profile');
});

// Update User Profile
router.put('/profile', (req, res) => {
    res.send('Update User Profile');
});

// Delete User Profile
router.delete('/profile', (req, res) => {
    res.send('Delete User Profile');
});

// Get All Users (Admin Only)
router.get('/', (req, res) => {
    res.send('Get All Users');
});

module.exports = router;
