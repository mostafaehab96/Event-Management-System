import express from "express";
import cors from "cors";
import router from "./routers/eventRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", router);

export default app;
