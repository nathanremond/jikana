const express = require("express");
const router = express.Router();
const MovieModel = require("../models/movieModel");

/**
 * @swagger
 * /movie/{id}:
 *   get:
 *     summary: Get a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie
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
router.get("/movie/:id", async (req, res) => {
  try {
    const id = req.params["id"];
    const result = await MovieModel.getById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /movie:
 *   get:
 *     summary: Get a movie by keywords and category ID
 *     tags: [Movies]
 *     parameters:
 *       - name: keywords
 *         in: query
 *         required: true
 *         description: The keywords to search for
 *         schema:
 *           type: string
 *       - name: category
 *         in: query
 *         required: true
 *         description: The ID of the category
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
router.get("/movie", async (req, res) => {
  try {
    const keywords = req.query.keywords;
    const id_category = req.query.category;
    const result = await MovieModel.getByKeywordsAndCategory(
      keywords,
      id_category
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /movie:
 *   post:
 *     summary: Create a movie
 *     tags: [Movies]
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         description: Informations of the movie
 *         schema:
 *           type: string
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
router.post("/movie", async (req, res) => {
  try {
    const result = await MovieModel.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /movie/{id}:
 *   put:
 *     summary: Update a movie
 *     tags: [Movies]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie
 *         schema:
 *           type: integer
 *       - name: body
 *         in: body
 *         required: true
 *         description: Informations of the movie
 *         schema:
 *           type: string
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
router.put("/movie/:id", async (req, res) => {
  try {
    const result = await MovieModel.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /movie/{id}:
 *   delete:
 *     summary: Delete a movie
 *     tags: [Movies]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the movie
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
router.delete("/movie/:id", async (req, res) => {
  try {
    await MovieModel.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
