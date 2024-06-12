import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/send-notification-to-users", (req, res) => {
  // get from params room name
  const room = req.query.room as string;
  io.to("room-1").to("room-2").emit("hello", "world");
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join-room", (room) => {
    console.log("joined room", room);
    socket.join(room);
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
