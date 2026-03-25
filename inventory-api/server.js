const express = require('express');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api.route');

const app = express();
app.use(express.json());

// Thay thế chuỗi kết nối bằng MongoDB URI của bạn (VD: MongoDB Atlas hoặc Local)
mongoose.connect('mongodb://127.0.0.1:27017/inventory_db')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api', apiRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});