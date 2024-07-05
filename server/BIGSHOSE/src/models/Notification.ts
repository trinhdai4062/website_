import { decrypt } from 'dotenv';
import mongoose, { Schema, Document } from 'mongoose';

// Định nghĩa interface cho mô hình danh mục sản phẩm
export interface INotification extends Document {
    userId: INotification;
    token:string;
    tokens:string[];
    topic:string;
    imageUrl:string;
    title: string;
    body: string;
    status: 0|1;
    createAt: Date;
    scheduleTime:Date;
}

// Định nghĩa schema cho danh mục sản phẩm
const notificationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    token:{type:String},
    tokens: [{ type: String }],
    topic:{type:String},
    imageUrl:{type:String},
    title:{type:String},
    body:{type:String},
    status: {type: Number,default:0},
    createAt: { type: Date, default: Date.now },
    scheduleTime: { type: Date, required: true }
});

// Tạo model từ schema
export default mongoose.model<INotification>('Notification', notificationSchema);
