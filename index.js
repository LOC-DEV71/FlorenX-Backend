const express = require("express");
require("dotenv").config();
const dataBase = require("./config/dataBase")

const cookieParser = require("cookie-parser");

const routes = require("./api/v1/routes/index.routes");

const cors = require("cors");

dataBase.connect();


const app = express();
const port = process.env.PORT;

// middleware parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({
  origin: process.env.CONNECT_FE,
  credentials: true
}));





routes(app);

app.listen(port, () => {
    console.log(`App listening in port ${port}`)
})
