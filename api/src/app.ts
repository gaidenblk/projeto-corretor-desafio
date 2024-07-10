import express from "express";
import adminRoutes from "./routes/adminRoutes";
import correctorRoutes from "./routes/correctorRoutes";
import correctionRoutes from "./routes/correctionRoutes";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.json({ data: { ok: true }, err: null });
});

app.use("/", adminRoutes);
app.use("/", correctorRoutes);
app.use("/", correctionRoutes);

app.use((req, res, next) => {
  res.status(404).send("Not Found");
});

export default app;
