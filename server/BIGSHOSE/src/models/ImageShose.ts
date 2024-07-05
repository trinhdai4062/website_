import mongoose, { Schema, Document } from 'mongoose';

interface IMGShose extends Document {
    productId:mongoose.Types.ObjectId;
    images:string[];
}

const ShoeSchema: Schema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Shose', required: true }, // Tham chiếu đến collection 'Product'
    images:[{ type: String, required: true }] 
});

const IMGShoseModel =  mongoose.model<IMGShose>('ImageShose', ShoeSchema);

export { IMGShose, IMGShoseModel };
