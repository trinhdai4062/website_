import mongoose, { Schema, Document } from 'mongoose';

// Định nghĩa interface cho mô hình danh mục sản phẩm
export interface IPayment extends Document {
    userId:IPayment;
    stk:number;
    nameAccount:string;
    nameBank:string;
    image?:string;
    description:string;
    status?:boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Định nghĩa schema cho danh mục sản phẩm
const payMentSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users',required: true  },
    stk: { type: Number,required: true,unique:true  },
    nameAccount:{ type: String,required: true},
    nameBank:{ type: String,required: true,unique:true},
    image:{ type: String},
    description:{ type: String,required: true },
    status:{ type: Boolean,default:false },
   
},{
    timestamps: true 
});

// Tạo model từ schema
export default mongoose.model<IPayment>('Payment', payMentSchema);
