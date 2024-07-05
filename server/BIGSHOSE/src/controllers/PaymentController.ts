// src/controllers/ShoseController.ts
import { Request, Response } from 'express';
import Shose from '../models/Shose';
import { status } from '../utils/Nocatification';
import Users from '../models/Users';
import Payment,{ IPayment } from '../models/Payment';

export class PaymentController {
    public async CREATE_PAYMENT(req: Request, res: Response): Promise<void> {
        try {
            const userId: any = await Users.findOne({ _id: req.body.userId });
            if (!userId) {
                status(res, false, "Không tìm thấy userId");
                return;
            }
            const newPayment: IPayment = new Payment({...req.body})
            const savePayment = await newPayment.save();
            // console.log('newShose', newPayment);
            await userId.updateOne({ $push: { idPayment: newPayment._id } })
           
            status(res, true, savePayment);

        } catch (err) {
            status(res, false, err);
        }
    }
    public async ALL_PAYMENT(req: Request, res: Response): Promise<void> {
        try {
            const payment: IPayment[] = await Payment.find();
            status(res, true, payment);
        } catch (err) {
            status(res, false, err);
        }
    }
    public async AN_PAYMENT(req: Request, res: Response): Promise<void> {
        try {
            const findPayment = await Payment.findById(req.params.id);
            if (findPayment !== null) {
                if (findPayment.userId !== null) {
                    const order = await Payment.findById(req.params.id)
                        .populate({
                            path: 'userId',
                            select: '-password'
                        });
                    // const shoses = await Shose.findById(req.params.id).populate('parentCategory').populate('userId');
                    res.status(200).json({ status: true, data: order })
                } else {
                    status(res, true, findPayment);
                }
            } else {
                status(res, false, "Id Order not found");
            }
        } catch (err) {
            status(res, false, err);
        }
    }
    public async UPDATE_PAYMENT(req: Request, res: Response): Promise<void> {
        try {
            const payment = await Payment.findById(req.params.id);
            if (payment) {
                const update = {...req.body};
                delete update.createdAt;
                delete update.userId;
                await payment.updateOne({ $set: update });
                status(res, true, "Update success")
            } else {
                status(res, false, "Id order not found");
            }

        } catch (err) {
            status(res, false, err);
        }
    }
    public async DELETE_PAYMENT(req: Request, res: Response): Promise<void> {
        try {
            const payment: any = await Payment.findById(req.params.id);
            const findUser = await Users.find({ idPayment: req.params.id });
            if (payment) {
                if (findUser) {
                    await Users.updateMany({ idPayment: req.params.id }, { $pull: { idPayment: req.params.id } });
                }
                await Payment.findByIdAndDelete(req.params.id);
                status(res, true, "Delete product success")
            } else {
                status(res, false, "Id order not found");
            }

        } catch (err) {
            status(res, false, err);
        }
    }
}
