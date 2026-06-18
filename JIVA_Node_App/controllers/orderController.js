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

    // 1. Fetch the actual packages from the DB to verify prices
    const selectedPackages = await Package.findAll({
      where: {
        id: packageIds
      }
    });

    if (selectedPackages.length !== packageIds.length) {
      return res.status(400).json({ message: 'One or more invalid package IDs provided' });
    }

    // 2. Calculate the total amount
    // Reduce loops through the packages and adds up all the prices
    const totalAmount = selectedPackages.reduce((acc, pkg) => acc + pkg.price, 0);

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
