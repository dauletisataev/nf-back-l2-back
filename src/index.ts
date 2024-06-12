import "dotenv/config";
import express from "express";
import { Server } from "socket.io";
import { createServer } from "node:http";
import { chatModel } from "./chat/models/chat";
import mongoose from "mongoose";
import { messageModel } from "./chat/models/message";
import connectDB from "./db";
import User from "./auth/models/User";

const app = express();
const server = createServer(app);
const io = new Server(server);

connectDB();

app.get("/send-notification-to-users", (req, res) => {
  // get from params room name
  const room = req.query.room as string;
  io.to("room-1").to("room-2").emit("hello", "world");
  res.send("Hello World");
});

app.get("/test-chat-creation", async (req, res) => {
  const message = await messageModel.create({
    text: "message1",
    sender: new mongoose.Types.ObjectId("6668070f88dbf6aed3a00216"),
    chat: new mongoose.Types.ObjectId("6668070f88dbf6aed3a00216"),
  });

  await chatModel.create({
    participants: [
      new mongoose.Types.ObjectId("6668070f88dbf6aed3a00216"),
      new mongoose.Types.ObjectId("6668070f88dbf6aed3a00216"),
    ],
    lastMessage: message.id,
  });

  res.send("Chat created");
});

app.get("/api/chats/:id", async (req, res) => {
  await User.countDocuments();

  const chatID = req.params.id;
  const chat = await chatModel
    .findById(chatID)
    .populate("participants")
    .populate("lastMessage");

  const messages = await messageModel.find({ chat: chat!.id });

  res.json({ chat, messages });
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
