const Order = require('../models/Order');
const Package = require('../models/Package');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Logged in users only)
const createOrder = async (req, res) => {
  try {
    const { packageIds } = req.body;

    if (!packageIds || packageIds.length === 0) {
      return res.status(400).json({ message: 'No packages selected' });
    }

    // 1. Fetch the actual packages from the DB to verify prices and types
    const selectedPackages = await Package.findAll({
      where: {
        id: packageIds
      }
    });

    if (selectedPackages.length !== packageIds.length) {
      return res.status(400).json({ message: 'One or more invalid package IDs provided' });
    }

    // Verify that the mandatory Basic Package is included
    const hasBase = selectedPackages.some(pkg => pkg.type === 'base');
    if (!hasBase) {
      return res.status(400).json({ message: 'The Basic Package ($299) is mandatory for checkout.' });
    }

    // 2. Enforce the Pricing Rules securely
    // The Baseline Rule: Set the price of the Basic Package to $299
    // The Add-On Rule: Set the price of each additional package to $99
    const addonCount = selectedPackages.filter(pkg => pkg.type === 'addon').length;
    const totalAmount = 299.00 + (addonCount * 99.00);

    // 3. Create the order in the database
    // Notice how we use req.user.id! The Bouncer (middleware) put that there for us.
    const order = await Order.create({
      userId: req.user.id,
      packageIds: packageIds,
      totalAmount: totalAmount,
      status: 'pending' // Order is pending until payment is successful
    });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error while creating order' });
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders/myorders
// @access  Private (Logged in users only)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id }
    });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error while fetching orders' });
  }
};

module.exports = { createOrder, getMyOrders };
