const express = require('express');
const router = express.Router();
const { getDB } = require('../db.js');
const  ObjectID  = require('mongodb').ObjectId;

// Insert a breed
router.post('/', async (req, res) => {
  try {
    // Inserting the breed
    const result = await getDB().collection('Breeds').insertOne({
      breedId: req.body.breedId,
      breedName: req.body.breedName
    });

    if (result.acknowledged) {
      res.status(201).json({ message: 'Breed added successfully' });
    } else {
      res.status(500).json({ error: 'Failed to insert breed.' });
    }
  } catch (error) {
    console.error('error inserting breed:', error);

    if (error.code === 11000) {
      // Duplicate key error
      res.status(409).json({ message: 'Duplicate breedId not allowed' });
    } else {
      res.status(500).json({ message: error.message});
    }
  }
});

// Get all breeds
router.get('/', async (req, res) => {
  const db = getDB();

  try {
    const breeds = await db.collection('Breeds').find().toArray();
    res.status(200).json(breeds);
  } catch (error) {
    console.error('error getting breeds:', error);
    res.status(500).json({ error: 'An error occurred when getting breeds' });
  }
});

// Add PUT endpoint to update a breed
router.put('/:id', async (req, res) => {
  const { breedId, breedName } = req.body;

  if (!breedId || !breedName  === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  const db = getDB();
  const collection = db.collection('Breeds');

  try {
      await collection.updateOne(
          { _id: new ObjectID(req.params.id) },
          { $set: { breedId, breedName } }
      );

      return res.status(200).json({ message: 'Breed updated successfully.' });
  } catch (error) {
      console.error('Error updating breed data in the database.', error);
      return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Add DELETE endpoint to delete a tag
router.delete('/:id', async (req, res) => {
  const db = getDB();
  const collection = db.collection('Breeds');

  try {
      await collection.deleteOne({ _id: new ObjectID(req.params.id) });

      return res.status(200).json({ message: 'Breed deleted successfully.' });
  } catch (error) {
      console.error('Error deleting breed from the database.', error);
      return res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
