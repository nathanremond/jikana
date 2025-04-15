const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const UserModel = require("../models/userModel");

const SECRET_KEY = process.env.SECRET_KEY;

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Users]
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         description: Informations of the user
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
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.getByEmail(email);
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordValid) {
      return res.status(401).json({ error: "Identifiants invalides" });
    }
    const payload = {
      id_user: user.id_user,
      email: user.email,
      id_role: user.id_role,
    };
    const token = jwt.sign(payload, SECRET_KEY, {
      expiresIn: "2h",
    });

    res.json({
      token,
      id_user: user.id_user,
      email: user.email,
      id_role: user.id_role,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         description: Informations of the user
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
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const id_role = 2;
    const user = await UserModel.create(
      firstname,
      lastname,
      email,
      hashedPassword,
      id_role
    );
    res.status(201).json({ message: "Utilisateur crée", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
