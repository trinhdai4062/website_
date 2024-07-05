import mongoose, { Schema, Document } from 'mongoose';

// Định nghĩa interface cho mô hình danh mục sản phẩm
export interface InformationUser extends Document {
    userId:InformationUser;
    name?:string;
    phone?: string;
    address?:string;
    ip?:string;
    location?:string[];
    createdAt: Date;
    updatedAt: Date;
}

// Định nghĩa schema cho danh mục sản phẩm
const informationSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users',unique: true, immutable: true},
    name: { type: String },
    phone: {type:String},
    address: {type:String},
    ip: { type: String},
    location: [{ type: String }],
  
},{
    timestamps: true 
});

// Tạo model từ schema
export default mongoose.model<InformationUser>('InformationUser', informationSchema);
