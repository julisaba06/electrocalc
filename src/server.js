
import app from "./app.js";
import { env } from "./config/env.js";
import "./config/database.js";

app.listen(env.port, () => {
  console.log(`ElectricalC API escuchando en el puerto ${env.port}`);
});
