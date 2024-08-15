import express from "express";
import { createServer } from "http";

const app = express();
const port = 8083;
import { Server } from "socket.io";
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});

httpServer.listen(port, () => {
  console.log(`web socket app listening on port ${port}`);
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // client requests to join the room with roomId
  socket.on("join-room", ({ roomId, userName }) => {
    // TODO:- also add acknowledgement section to the client
    socket.join(roomId);
    socket.to(roomId).emit("newly-joined", {roomId, userName});
  });

  // client requests to send this message to everyone in the room
  socket.on("send-msg", (data) => {
    const { roomId, userName, message } = data;
    // send this message to everyone in the room except the sender
    socket.to(roomId).emit("recieve-msg", { userName, message });
  });
});
