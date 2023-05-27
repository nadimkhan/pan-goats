const express = require('express');
const router = express.Router();
const { getDB } = require('../db.js');
const  ObjectID  = require('mongodb').ObjectId;


router.post('/', async (req, res) => {
    const { tagId, tagColor, dateOfAcquiring } = req.body;
    
    if (!tagId || !tagColor || !dateOfAcquiring) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    const db = getDB();
    const collection = db.collection('Tags');
  
    try {
      // Check if tagId already exists in the database
      const existingTag = await collection.findOne({ tagId });
  
      if (existingTag) {
        return res.status(400).json({ message: 'Tag ID already exists.' });
      }
  
      // Add new tag to the database
      await collection.insertOne({ tagId, tagColor, dateOfAcquiring, status: 'available' });
  
      return res.status(201).json({ message: 'Tag added successfully.' });
    } catch (error) {
      console.error('Error inserting tag data into database.', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  });

  router.get('/', async (req, res) => {
    const db = getDB();
    const collection = db.collection('Tags');
  
    try {
      const tags = await collection.find().toArray();
      return res.status(200).json(tags);
    } catch (error) {
      console.error('Error fetching tags from database.', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  });

// Add PUT endpoint to update a tag
router.put('/:id', async (req, res) => {
  const { tagId, tagColor, dateOfAcquiring, status } = req.body;

  if (!tagId || !tagColor || !dateOfAcquiring || !status === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  const db = getDB();
  const collection = db.collection('Tags');

  try {
      await collection.updateOne(
          { _id: new ObjectID(req.params.id) },
          { $set: { tagId, tagColor, dateOfAcquiring, status } }
      );

      return res.status(200).json({ message: 'Tag updated successfully.' });
  } catch (error) {
      console.error('Error updating tag data in the database.', error);
      return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Add DELETE endpoint to delete a tag
router.delete('/:id', async (req, res) => {
  const db = getDB();
  const collection = db.collection('Tags');

  try {
      await collection.deleteOne({ _id: new ObjectID(req.params.id) });

      return res.status(200).json({ message: 'Tag deleted successfully.' });
  } catch (error) {
      console.error('Error deleting tag from the database.', error);
      return res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
