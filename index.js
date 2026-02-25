const express = require("express");
require("dotenv").config();
const dataBase = require("./config/dataBase")

const cookieParser = require("cookie-parser");

const routes = require("./api/v1/routes/index.routes");

const cors = require("cors");

const http = require("http");            
const { Server } = require("socket.io");  


dataBase.connect();


const app = express();
const port = process.env.PORT;


// middleware parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(cors({
  origin: [
    process.env.CONNECT_FE,
    "http://localhost:5173"
  ],
  credentials: true
}));





routes(app);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CONNECT_FE,
    credentials: true
  }
});
app.set("io", io);

require("./api/v1/sockets/index.socket")(io)


server.listen(port, () => {
  console.log(`Server + Socket listening on port ${port}`);
});