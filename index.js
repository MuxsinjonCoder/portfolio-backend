import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import registerRoute from "./src/routes/user.routes.js";
import postsRoute from "./src/routes/posts.routes.js";
import { corsOptions } from "./src/config/corsOptions.js";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import uploadRoute from "./src/routes/upload.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Swagger sozlamalari
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio website Backend API",
      version: "1.0.0",
      description: "API documentation for Portfolio website Backend",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(cors(corsOptions));

app.use("/api/auth", registerRoute);
app.use("/api/posts", postsRoute);
app.use("/api/upload", uploadRoute);

app.listen(PORT, () => {
  connectDB();
  console.log("server started at http://localhost:" + PORT);
});
