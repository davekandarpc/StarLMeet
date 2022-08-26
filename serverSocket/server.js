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
  socket.on("join room", (roomID) => {
    console.log("joined ", roomID);
    if (rooms[roomID]) {
      // Receiving peer joins the room
      rooms[roomID].push(socket.id);
    } else {
      // Initiating peer create a new room
      rooms[roomID] = [socket.id];
    }

    /*
            If both initiating and receiving peer joins the room,
            we will get the other user details.
            For initiating peer it would be receiving peer and vice versa.
        */
    console.log(
      "room ",
      rooms[roomID].find((id) => id !== socket.id)
    );
    const otherUser = rooms[roomID].find((id) => id !== socket.id);
    if (otherUser) {
      console.log("other user ", otherUser);
      socket.emit("other user", otherUser);
      socket.to(otherUser).emit("user joined", socket.id);
    }
  });

  socket.on("left", (roomID) => {
    console.log("left ", roomID);
    console.log("rooms Before", rooms);
    console.log("rooms Before lenght", rooms[roomID.roomId].length);
    if (rooms[roomID.roomId].length > 2) {
      rooms[roomID.roomId].splice(0, rooms[roomID.roomId].length);
    } else {
      let index = rooms[roomID.roomId].indexOf(roomID.currentUser);
      rooms[roomID.roomId].splice(index, 1);
    }

    console.log("rooms After ", rooms);
    socket.leave(roomID);
    socket.to(roomID).emit("user left", socket.id);
  });

  /*
        The initiating peer offers a connection
    */
  socket.on("offer", (payload) => {
    console.log("offer ", payload);
    io.to(payload.target).emit("offer", payload);
  });

  /*
        The receiving peer answers (accepts) the offer
    */
  socket.on("answer", (payload) => {
    console.log("answer -->", payload);
    io.to(payload.target).emit("answer", payload);
  });

  socket.on("ice-candidate", (incoming) => {
    // console.log("ice-candidate ", incoming);
    io.to(incoming.target).emit("ice-candidate", incoming.candidate);
  });
});

server.listen(9000, () => console.log("Server is up and running on Port 9000"));
