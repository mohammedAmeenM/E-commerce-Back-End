const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });
const app = require("./app");
const connect = require("./config/db_conection");

connect();
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`server running is :${port}`);
});
