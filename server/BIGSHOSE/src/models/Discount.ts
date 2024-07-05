import mongoose, { Schema, Document } from 'mongoose';
// import { SIGShose } from './Users';

// Định nghĩa interface cho mô hình "Discount"
export interface IDisscount extends Document {
    idUser: IDisscount;
    name: string;
    quantity: number;
    status?: boolean;
    discountType: string; // Loại giảm giá, ví dụ: "percent" hoặc "fixed"
    discountValue: number;
    startDate?: Date;
    endDate: Date;
    createdAt: Date;
}

const disscountSchema = new Schema({
    idUser: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, unique: true },
    quantity: { type: Number, default: 0 },
    status: { type: Boolean, default: false },
    discountType: { type: String, enum: ['percent', 'fixed'], required: true },
    discountValue: { type: Number, required: true }, 
    startDate: { type: Date, default: Date.now, required: true },
    endDate: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

disscountSchema.pre('save', function (next) {
    const currentDate = new Date();
    currentDate.setSeconds(0, 0); // Đặt giờ phút giây về 0

    const startDateOnly = new Date(this.startDate);
    startDateOnly.setSeconds(0, 0);

    if (this.quantity > 0) {
        // console.log('startDateOnly.getTime()',startDateOnly.getTime())
        // console.log('currentDate.getTime()',currentDate.getTime())
        if (startDateOnly.getTime() === currentDate.getTime()) {
            this.status = true;
        } else {
            this.status = false;
        }
    } else {
        this.status = false;
    }
    next();
});

const Discount = mongoose.model<IDisscount>('Discount', disscountSchema);

export default Discount; 
