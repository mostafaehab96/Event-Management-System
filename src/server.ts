import app from "./app";
import { connectToDatabase } from "./config/db";
import { env } from "process";
import "dotenv/config";

const PORT = Number(env.PORT) || 8000;
const HOST = env.HOST || "localhost";

connectToDatabase().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`Listening on port ${PORT} and host ${HOST}`);
  });
});
