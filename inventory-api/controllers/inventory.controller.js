const Product = require('../models/product.model');
const Inventory = require('../models/inventory.model');

// 1. Tạo Product kèm theo tạo Inventory tương ứng
exports.createProduct = async (req, res) => {
    try {
        const { name, price } = req.body;
        const newProduct = await Product.create({ name, price });

        // Tự động tạo Inventory với các giá trị mặc định (0)
        const newInventory = await Inventory.create({ product: newProduct._id });

        res.status(201).json({ product: newProduct, inventory: newInventory });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Lấy tất cả inventory (có join với product)
exports.getAllInventories = async (req, res) => {
    try {
        const inventories = await Inventory.find().populate('product');
        res.status(200).json(inventories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Lấy inventory theo ID (có join với product)
exports.getInventoryById = async (req, res) => {
    try {
        const inventory = await Inventory.findById(req.params.id).populate('product');
        if (!inventory) return res.status(404).json({ message: 'Inventory not found' });
        res.status(200).json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Add_stock: Tăng stock
exports.addStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const updatedInventory = await Inventory.findOneAndUpdate(
            { product: product },
            { $inc: { stock: quantity } }, // Tăng stock
            { new: true, runValidators: true }
        );
        res.status(200).json(updatedInventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Remove_stock: Giảm stock
exports.removeStock = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        // Kiểm tra điều kiện stock >= quantity trước khi trừ để tránh âm
        const updatedInventory = await Inventory.findOneAndUpdate(
            { product: product, stock: { $gte: quantity } },
            { $inc: { stock: -quantity } }, // Giảm stock
            { new: true, runValidators: true }
        );

        if (!updatedInventory) return res.status(400).json({ message: 'Not enough stock or Product not found' });
        res.status(200).json(updatedInventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Reservation: Giảm stock, tăng reserved
exports.reservation = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const updatedInventory = await Inventory.findOneAndUpdate(
            { product: product, stock: { $gte: quantity } },
            { $inc: { stock: -quantity, reserved: quantity } },
            { new: true, runValidators: true }
        );

        if (!updatedInventory) return res.status(400).json({ message: 'Not enough stock to reserve' });
        res.status(200).json(updatedInventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 7. Sold: Giảm reserved, tăng soldCount
exports.sold = async (req, res) => {
    try {
        const { product, quantity } = req.body;
        const updatedInventory = await Inventory.findOneAndUpdate(
            { product: product, reserved: { $gte: quantity } },
            { $inc: { reserved: -quantity, soldCount: quantity } },
            { new: true, runValidators: true }
        );

        if (!updatedInventory) return res.status(400).json({ message: 'Not enough reserved items to sell' });
        res.status(200).json(updatedInventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};