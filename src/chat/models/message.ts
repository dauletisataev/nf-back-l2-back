import mongoose from "mongoose";

export interface IMessage {
  text: string;
  sender: mongoose.Types.ObjectId;
  chat: mongoose.Types.ObjectId;
}

export interface MessageModel extends IMessage, mongoose.Document {}

const chatSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const messageModel = mongoose.model<MessageModel>("message", chatSchema);

export { messageModel };
