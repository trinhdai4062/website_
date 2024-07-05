import mongoose, { Schema, Document } from 'mongoose';

// Định nghĩa interface cho mô hình danh mục sản phẩm
export interface ICart extends Document {
    productId:string;
    name:string;
    image: string;
    quatity:string;
    price:number;
    createdAt: Date;
    updatedAt: Date;
}

// Định nghĩa schema cho danh mục sản phẩm
const cartSchema: Schema = new Schema({
    productId: {  type: Schema.Types.ObjectId, ref: 'Shose',unique: true },
    name: { type: String, required: true },
    image: {type:String,required: true},
    quatity: { type: Number,default: 0 },
    price: { type: Number,default: 0  }
},{
    timestamps: true 
});

// Tạo model từ schema
export default mongoose.model<ICart>('Cart', cartSchema);
