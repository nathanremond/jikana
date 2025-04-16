const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

// Définission des options pour swagger-jsdoc
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Jikana",
      version: "1.0.0",
      description: "",
    },
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsdoc(options);

// Initialisation de l'application api avec express
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Initialisation de la clé pour se connecter à un compte
const SECRET_KEY = process.env.SECRET_KEY;

// Route pour swagger UI
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

// Endpoints
const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);

const movieRoutes = require("./routes/movieRoutes");
app.use("/", movieRoutes);

const orderRoutes = require("./routes/orderRoutes");
app.use("/", orderRoutes);

const scheduleRoutes = require("./routes/scheduleRoutes");
app.use("/", scheduleRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});