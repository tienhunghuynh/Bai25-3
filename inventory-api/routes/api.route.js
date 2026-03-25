const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');

router.post('/products', inventoryController.createProduct);
router.get('/inventories', inventoryController.getAllInventories);
router.get('/inventories/:id', inventoryController.getInventoryById);

router.post('/inventories/add-stock', inventoryController.addStock);
router.post('/inventories/remove-stock', inventoryController.removeStock);
router.post('/inventories/reservation', inventoryController.reservation);
router.post('/inventories/sold', inventoryController.sold);

module.exports = router;