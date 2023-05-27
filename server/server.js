const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/users');
const breedRoutes = require('./routes/breeds');
const tagRoutes = require('./routes/tags');
const vendorRoutes = require('./routes/vendors');

const medicineRoutes = require('./routes/medicines');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

db.connectToDB().then(() => {
    console.log("Successfully connected to the database");
});

app.use('/api/users', userRoutes);
app.use('/api/breeds', breedRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/medicines', medicineRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
