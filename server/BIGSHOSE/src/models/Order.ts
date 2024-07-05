import { decrypt } from 'dotenv';
import mongoose, { Schema, Document } from 'mongoose';

// Định nghĩa interface cho mô hình danh mục sản phẩm
export interface IOrder extends Document {
    userId: IOrder;
    productId: string;
    discountId?: string;
    nameKH: string;
    address: string;
    nameproduct: string;
    quantity: number;
    price: number;
    codeDiscount?:string;
    priceDiscount?: number;
    amount: number;
    description: string;
    status: 0 | 1 | 2 | 3 | 4 | 5;
    createdAt: Date;
    updatedAt: Date;
}

// Định nghĩa schema cho danh mục sản phẩm
const orderSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Shose', required: true },
    discountId: { type: Schema.Types.ObjectId, ref: 'Discount' },
    idKH: { type: Schema.Types.ObjectId,ref: 'Users'},
    informationId: { type: Schema.Types.ObjectId,ref: 'InformationUser',  required: true },
    paymentId:  { type: Schema.Types.ObjectId,ref: 'Payment',  required: true },
    quantity: { type: Number, default: 0, required: true },
    price: { type: Number, default: 0, required: true },
    codeDiscount:{ type: String },
    priceDiscount: { type: Number},
    amount: { type: Number, default: 0, required: true },
    description: { type: String, required: true, unique: true },
    status: { type: Number, required: true },
  
},{
    timestamps: true 
});

// Tạo model từ schema
export default mongoose.model<IOrder>('Order', orderSchema);
