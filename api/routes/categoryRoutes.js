const express = require("express");
const router = express.Router();
const CategoryModel = require("../models/categoryModel");

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get a list of all categories
 *     tags: [Categories]
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
router.get("/category", async (req, res) => {
  try {
    const result = await CategoryModel.getAll();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
