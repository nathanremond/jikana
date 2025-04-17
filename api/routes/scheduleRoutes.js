const express = require("express");
const router = express.Router();
const ScheduleModel = require("../models/scheduleModel");

/**
 * @swagger
 * /schedule/{id}:
 *   get:
 *     summary: Get a schedule by ID
 *     tags: [Schedules]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the schedule
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
router.get("/schedule/:id", async (req, res) => {
  try {
    const id = req.params["id"];
    const result = await ScheduleModel.getById(id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /schedule:
 *   post:
 *     summary: Create a schedule
 *     tags: [Schedules]
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         description: Informations of the schedule
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
router.post("/schedule", async (req, res) => {
  try {
    const result = await ScheduleModel.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /schedule/{id}:
 *   put:
 *     summary: Update a schedule
 *     tags: [Schedules]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the schedule
 *         schema:
 *           type: integer
 *       - name: body
 *         in: body
 *         required: true
 *         description: Informations of the schedule
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
router.put("/schedule/:id", async (req, res) => {
  try {
    const result = await ScheduleModel.update(req.params.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /schedule:
 *   delete:
 *     summary: Delete a schedule
 *     tags: [Schedules]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the schedule
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
router.delete("/schedule/:id", async (req, res) => {
  try {
    await ScheduleModel.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;