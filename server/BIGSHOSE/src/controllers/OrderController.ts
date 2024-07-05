// src/controllers/ShoseController.ts
import { Request, Response } from 'express';
import Order, { IOrder } from '../models/Order';
import Shose from '../models/Shose';
import { status } from '../utils/Nocatification';
import Users from '../models/Users';
import Discount from '../models/Discount';
import Information from '../models/InfomationUser';
import Payment from '../models/Payment';

export class OrderController {
    public async CREATE_ORDER(req: Request, res: Response): Promise<void> {
        try {
            const resp=req.body.data;
            const userId: any = await Users.findById(resp.userId);
            const productId: any = await Shose.findById(resp.productId);
            const idKH: any = await Users.findById(resp.idKH );
            const informationId: any = await Information.findById( resp.informationId);
            const paymentId:any=await Payment.findById(resp.paymentId)
            if (resp.discountId) {
                const discountId: any = await Discount.findById(resp.discountId);
                if (!discountId) {
                    status(res, false, "Không tìm thấy discountId");
                    return;
                }
                if(discountId.quantity>0){
                    await  discountId.updateOne({$set:{quantity:discountId.quantity-1}})
                }
            }
            if (!userId) {
                status(res, false, "Không tìm thấy userId");
                return;
            }
            if (!productId) {
                status(res, false, " Không tìm thấy productId");
                return;
            }
            
            if (!idKH) {
                status(res, false, " Không tìm thấy Id khách hàng");
                return;
            }
            if (!informationId) {
                status(res, false, " Không tìm thấy Id thong tin giao hang"); return;
            }
            if (!paymentId) {
                status(res, false, " Không tìm thấy Id phuong thuc thanh toan"); return;
            }
            const newOrder: IOrder = new Order({
                ...resp,
                status: 0
            });
            // console.log('newOrder',newOrder);
            // console.log('newShose', newOrder);
            await userId.updateOne({ $push: { idOrder: newOrder._id } })
            const saveShose = await newOrder.save();
            status(res, true, saveShose);

        } catch (err) {
            status(res, false, err);
        }
    }
    public async ALL_ORDER(req: Request, res: Response): Promise<void> {
        try {
            const shoses: IOrder[] = await Order.find();
            status(res, true, shoses);
        } catch (err) {
            status(res, false, err);
        }
    }
    public async AN_ORDER(req: Request, res: Response): Promise<void> {
        try {
            const findOrder = await Order.findOne({userId:req.params.id});
            if (findOrder !== null) {
                if (findOrder.userId !== null) {
                    const order = await Order.findById(req.params.id)
                        .populate('productId')
                        .populate({
                            path: 'userId',
                            select: '-password'
                        });
                    // const shoses = await Shose.findById(req.params.id).populate('parentCategory').populate('userId');
                    res.status(200).json({ status: true, data: order })
                } else {
                    status(res, true, findOrder);
                }
            } else {
                status(res, false, "Id Order not found");
            }
        } catch (err) {
            status(res, false, err);
        }
    }
    public async AN_DEPSCRIPTION(req: Request, res: Response): Promise<void> {
        try {
            const findOrder = await Order.findOne({ description: req.params.description });
            if (findOrder !== null) {
                status(res, true, findOrder);
            } else {
                status(res, false, "Id Order not found");
                
            }
        } catch (err) {
            status(res, false, err);
        }
    }
    public async UPDATE_ORDER(req: Request, res: Response): Promise<void> {
        try {
            const order = await Order.findById(req.params.id);
            if (order && req.body.status) {

                const update = {
                    status: req.body.status,
                    updatedAt: new Date()
                };
                await order.updateOne({ $set: update });
                status(res, true, "Update success")
            } else {
                status(res, false, "Id order not found");
            }

        } catch (err) {
            status(res, false, err);
        }
    }
    public async DELETE_ORDER(req: Request, res: Response): Promise<void> {
        try {
            const order: any = await Order.findById(req.params.id);
            const findUser = await Users.find({ idOrder: req.params.id });
            if (order) {
                if (findUser) {
                    await Users.updateMany({ idOrder: req.params.id }, { $pull: { idOrder: req.params.id } });
                }
                await Order.findByIdAndDelete(req.params.id);
                status(res, true, "Delete product success")
            } else {
                status(res, false, "Id order not found");
            }
        } catch (err) {
            status(res, false, err);
        }
    }
    

}
