import mongoose, { Schema, Document } from 'mongoose';

// Định nghĩa interface cho mô hình danh mục sản phẩm
export interface ICategory extends Document {
    name: string;
    description: string;
    parentShose?: ICategory;
    slug: string;
    image?: string;
    numberOfProducts: number;
    createdAt: Date;
    updatedAt: Date;
}

// Định nghĩa schema cho danh mục sản phẩm
const categorySchema: Schema = new Schema({
    name: { type: String, required: true,unique: true },
    description: { type: String, required: true },
    parentShose: [{ type: Schema.Types.ObjectId, ref: 'Shose'}],
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    numberOfProducts: { type: Number, default: 0 }
},{
    timestamps: true 
});

// Tạo model từ schema
export default mongoose.model<ICategory>('Category', categorySchema);
