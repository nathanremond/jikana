const express = require("express");
const router = express.Router();
const OrderModel = require("../models/ordermodel");

/**
 * @swagger
 * /user/{id_user}/order:
 *   get:
 *     summary: Get orders by user ID
 *     tags: [Orders]
 *     parameters:
 *       - name: id_user
 *         in: path
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad Request
 *         content:
 *          application/json:
 *            example:
 *             error:
 *              message: "Bad Request"
 */
router.get("/user/:id_user/order", async (req, res) => {
  try {
    const id_user = req.params.id_user;
    const result = await OrderModel.getByUser(id_user);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Create an order
 *     tags: [Orders]
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         description: Informations of the order
 *         schema:
 *           type: object
 *           properties:
 *            total_amount:
 *             type: number
 *            ordered_schedule:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id_schedule:
 *                    type: number
 *                  quantity:
 *                    type: number
 *           id_user:
 *            type: number
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad Request
 *         content:
 *          application/json:
 *            example:
 *             error:
 *              message: "Bad Request"
 */
router.post("/order", async (req, res) => {
  try {
    const result = await OrderModel.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
