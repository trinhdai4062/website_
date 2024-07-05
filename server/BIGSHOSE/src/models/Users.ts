import mongoose,{Schema,Document} from "mongoose";
import { IDisscount } from "./Discount";
import { timeStamp } from "console";

export interface SIGShose extends Document{
    username:string;
    email:string;
    password:string;
    fullName:string;
    createdAt:Date;
    updateAt:Date;
    role:string;
    shop:boolean;
    avatar:string;
    isActive:boolean;
    deviceToken:string;
    idProduct?: SIGShose;
    idDiscount?:SIGShose;
    idInformation?:SIGShose;
    idOrder?:SIGShose;
    idPayment?:SIGShose;
    idNotification?:SIGShose;
    idConversation?:SIGShose;
}

const UsersSchema:Schema=new Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    fullName:{type:String},
    role:{type:String,enum:['user','admin'],default:'user'},
    avatar:{type:String},
    shop:{type:Boolean,default:false},
    isActive:{type:Boolean,default:true},
    deviceToken:{ type: [String], required: true } ,
    idProduct: [{ type: Schema.Types.ObjectId, ref: 'Shose' }],
    idDiscount: [{ type: Schema.Types.ObjectId, ref: 'Discount' }],
    idInformation: [{ type: Schema.Types.ObjectId, ref: 'InformationUser' }],
    idOrder: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    idPayment: [{ type: Schema.Types.ObjectId, ref: 'Payment' }],
    idNotification: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
    idConversation: [{ type: Schema.Types.ObjectId, ref: 'Conversation' }],
},{
    timestamps: true 
});
export default mongoose.model<SIGShose>('Users',UsersSchema);


