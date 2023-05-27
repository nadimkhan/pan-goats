const express = require('express');
const router = express.Router();
const { getDB } = require('../db.js');
const  ObjectID  = require('mongodb').ObjectId;

router.post('/', async (req, res) => {
    const { medicineId, medicineName, availability } = req.body;

    if (!medicineId || !medicineName || availability === undefined) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const db = getDB();
    const collection = db.collection('Medicines');

    try {
        const existingMedicine = await collection.findOne({ medicineId });

        if (existingMedicine) {
            return res.status(400).json({ message: 'Medicine ID already exists.' });
        }

        await collection.insertOne({ medicineId, medicineName, availability });

        return res.status(201).json({ message: 'Medicine added successfully.' });
    } catch (error) {
        console.error('Error inserting medicine data into database.', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/', async (req, res) => {
    const db = getDB();
    const collection = db.collection('Medicines');

    try {
        const medicines = await collection.find().toArray();
        return res.status(200).json(medicines);
    } catch (error) {
        console.error('Error fetching medicines from database.', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Add PUT endpoint to update a medicine
router.put('/:id', async (req, res) => {
    const { medicineId, medicineName, availability } = req.body;
  
    if (!medicineId || !medicineName || availability === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
  
    const db = getDB();
    const collection = db.collection('Medicines');
  
    try {
      await collection.updateOne(
        { _id: new ObjectID(req.params.id) },
        { $set: { medicineId, medicineName, availability } },
      );
  
      return res.status(200).json({ message: 'Medicine updated successfully.' });
    } catch (error) {
      console.error('Error updating medicine data in the database.', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
  // Add DELETE endpoint to delete a medicine
  router.delete('/:id', async (req, res) => {
    const db = getDB();
    const collection = db.collection('Medicines');
  
    try {
      await collection.deleteOne({ _id: new ObjectID(req.params.id) });
  
      return res.status(200).json({ message: 'Medicine deleted successfully.' });
    } catch (error) {
      console.error('Error deleting medicine from the database.', error);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  });

module.exports = router;
