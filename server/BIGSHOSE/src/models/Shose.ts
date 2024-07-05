import mongoose, { Schema, Document } from 'mongoose';

// Định nghĩa interface cho sản phẩm giày
export interface IShose extends Document {
    userId?: IShose;
    name: string;
    brand: string;
    price: number;
    color: string[];
    size: string[];
    quantity: number;
    discount?: number;
    star?: number;
    description?: string;
    imageUrl?: string;
    favorite?: boolean;
    seller?: boolean;
    parentCategory: IShose,
    status: boolean,
    createdAt: Date;
    updatedAt: Date;
}

// Định nghĩa schema cho sản phẩm giày
const ShoseSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    name: { type: String, required: true, unique: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    color: [{ type: String, required: true }],
    size: [{ type: String, required: true }],
    quantity: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    star: { type: Number, default: 0 },
    description: { type: String, maxlength: 20000 },
    imageUrl: { type: String },
    favorite: { type: Boolean, default: false },
    seller: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
}, {
    timestamps: true 
});

// Tạo model từ schema
export default mongoose.model<IShose>('Shose', ShoseSchema);

// export { IShose, ShoseModel };
