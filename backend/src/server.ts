import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectMongo } from "./config/mongo.js";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import notesRoutes from "./routes/notes.js";
import { errorHandler } from "./middleware/error.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.use(errorHandler);

connectMongo().then(() => {
  app.listen(Number(env.PORT), () =>
    console.log(` API running on http://localhost:${env.PORT}`)
  );
});
