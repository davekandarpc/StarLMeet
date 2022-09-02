const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const rooms = {};

io.on("connection", (socket) => {
  /*
        If a peer is initiator, he will create a new room
        otherwise if peer is receiver he will join the room
    */
  console.log("message connection ");
  socket.on("message", ({ message, sid, r_id, time, rid }) => {
    console.log("message socket ", message, sid, r_id, time, rid);
    io.emit("message", { message, sid, r_id, time, rid });
  });
});

server.listen(9000, () => console.log("Server is up and running on Port 9000"));
