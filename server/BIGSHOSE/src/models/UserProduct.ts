import mongoose,{Schema,Document} from "mongoose";


export interface IUserProduct extends Document{
    userId?:string,
    productId:string,
}

const UserProduct:Schema=new Schema({
    userId:{type:String},
    productId: {  type: Schema.Types.ObjectId, ref: 'Shose',unique: true },
})

export default mongoose.model<IUserProduct>('UserProduct', UserProduct);