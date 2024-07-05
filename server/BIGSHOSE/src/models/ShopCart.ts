import mongoose, { Schema, Document } from 'mongoose';

// Định nghĩa interface cho mô hình danh mục sản phẩm
export interface IShopCart extends Document {
    userId:IShopCart;
    item:string[];
    total: number;
    createdAt: Date;
    updatedAt: Date;
}

// Định nghĩa schema cho danh mục sản phẩm
const shopCartSchema: Schema = new Schema({
    userId: {  type: Schema.Types.ObjectId, ref: 'Users',unique: true },
    item: [{type: Schema.Types.ObjectId,ref: 'Cart', required: true }],
    total: { type: Number, default: 0 ,required: true  },
},{
    timestamps: true 
});

// Tạo model từ schema
export default mongoose.model<IShopCart>('ShopCart', shopCartSchema);
