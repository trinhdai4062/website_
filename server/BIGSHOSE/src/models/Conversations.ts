import mongoose, { Schema, Document } from 'mongoose';


export interface IConversation extends Document {
    messageId:IConversation;
    name:string;
    times:Date;
}

const ConversationSchema: Schema = new Schema(
  {
    messageId:[{ type: Schema.Types.ObjectId, ref: 'Message', }],
    name: { type: String, required: true },
    times: { type: Date, default: Date.now },
  }
);

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
