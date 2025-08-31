import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectMongo } from "./config/mongo";
import { env } from "./config/env";
import authRoutes from "./routes/auth";
import notesRoutes from "./routes/notes";
import { errorHandler } from "./middleware/error";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

app.use(errorHandler);

connectMongo().then(() => {
  const PORT = process.env.PORT || env.PORT || 5000;
  app.listen(Number(env.PORT), () =>
    console.log(` API running on http://localhost:${env.PORT}`)
  );
});
