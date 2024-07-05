// src/models/MessageHistory.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  idConversation:IMessage;
  senderEmail: string;
  receiverEmail: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

const MessageSchema: Schema = new Schema(
  {
    idConversation: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    senderEmail: { type: String, required: true },
    receiverEmail: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
  }
);

export default mongoose.model<IMessage>('Message', MessageSchema);
