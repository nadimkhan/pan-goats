const express = require('express');
const router = express.Router();
const { getDB } = require('../db.js');
const  ObjectID  = require('mongodb').ObjectId;

router.post('/', async (req, res) => {
    const { vendorId, vendorName, vendorAddress, contactName, contactNumber, rating } = req.body;

    if (!vendorId || !vendorName || !vendorAddress || !contactName || !contactNumber || rating === undefined) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const db = getDB();
    const collection = db.collection('Vendors');

    try {
        const existingVendor = await collection.findOne({ vendorId });

        if (existingVendor) {
            return res.status(400).json({ message: 'Vendor ID already exists.' });
        }

        await collection.insertOne({ vendorId, vendorName, vendorAddress, contactName, contactNumber, rating });

        return res.status(201).json({ message: 'Vendor added successfully.' });
    } catch (error) {
        console.error('Error inserting vendor data into database.', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

router.get('/', async (req, res) => {
    const db = getDB();
    const collection = db.collection('Vendors');

    try {
        const vendors = await collection.find().toArray();
        return res.status(200).json(vendors);
    } catch (error) {
        console.error('Error fetching vendors from database.', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Add PUT endpoint to update a vendor
router.put('/:id', async (req, res) => {
    const { vendorId, vendorName, vendorAddress, contactName, contactNumber, rating } = req.body;

    if (!vendorId || !vendorName || !vendorAddress || !contactName || !contactNumber || rating === undefined) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const db = getDB();
    const collection = db.collection('Vendors');

    try {
        await collection.updateOne(
            { _id: new ObjectID(req.params.id) },
            { $set: { vendorId, vendorName, vendorAddress, contactName, contactNumber, rating } }
        );

        return res.status(200).json({ message: 'Vendor updated successfully.' });
    } catch (error) {
        console.error('Error updating vendor data in the database.', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

// Add DELETE endpoint to delete a vendor
router.delete('/:id', async (req, res) => {
    const db = getDB();
    const collection = db.collection('Vendors');

    try {
        await collection.deleteOne({ _id: new ObjectID(req.params.id) });

        return res.status(200).json({ message: 'Vendor deleted successfully.' });
    } catch (error) {
        console.error('Error deleting vendor from the database.', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
