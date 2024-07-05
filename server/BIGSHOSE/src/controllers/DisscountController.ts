import { Request, Response } from 'express';
import Discount, { IDisscount } from '../models/Discount'; // Import mô hình
import Users from '../models/Users';

export class DiscountController {


    // Lấy danh sách tất cả các discount
    public async getAllDiscounts(req: Request, res: Response) {
        try {
            const discounts = await Discount.find();
            res.status(200).json(discounts);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Không thể lấy danh sách discounts', error });
        }
    }
    public async createDiscount(req: Request, res: Response) {
        try {
            const { startDate, endDate, idUser} = req.body;
            const startDateISO = startDate ? new Date(startDate).toISOString() : null;
            const endDateISO = new Date(endDate).toISOString();

            // Kiểm tra sự tồn tại của người dùng
            const idUsers = await Users.findById(idUser);
            if (!idUsers) {
                return res.status(400).json({
                    success: false,
                    message: 'IdUser không tìm thấy',
                });
            }

            // Kiểm tra sự tồn tại của tên discount
            const existingDiscount = await Discount.findOne({ name:req.body.name });
            if (existingDiscount) {
                return res.status(400).json({
                    success: false,
                    message: 'Tên mã giảm giá đã tồn tại',
                });
            }
            // Tạo dữ liệu discount
            const discountData = {
                ...req.body,
                endDate: endDateISO,
            };

            if (startDateISO) {
                discountData.startDate = startDateISO;
            }

            const newDiscount = new Discount(discountData);

            // Cập nhật người dùng và lưu discount mới
            await idUsers.updateOne({ $push: { idDiscount: newDiscount._id } });
            await newDiscount.save();

            res.status(200).json(newDiscount);  
        } catch (error) {
            console.error('Lỗi khi tạo discount:', error);
            res.status(400).json({
                success: false,
                message: 'Không thể tạo discount, mã giảm giá có thể bị trùng lặp, định dạng ngày giờ phải là: 2024-05-05T23:00:00',
                error,
            });
        }
    }

    public static async updateDiscountStatuses() {
        const currentDate = new Date();
        // Vô hiệu hóa các mã giảm giá có startDate chưa đến nhưng status là true
        const invalidDiscounts = await Discount.find({
            startDate: { $gt: currentDate }, // startDate lớn hơn ngày hiện tại
            status: true, // trạng thái là true
        });
        const invalidatePromises = invalidDiscounts.map((discount) => {
            discount.status = false;
            return discount.save();
        });
        await Promise.all(invalidatePromises);
        // Vô hiệu hóa các mã giảm giá đã hết hạn
        const expiredDiscounts = await Discount.find({
            endDate: { $lt: currentDate },
            status: true,
        });
        const deactivatePromises = expiredDiscounts.map((discount) => {
            discount.status = false;
            return discount.save();
        });

        await Promise.all(deactivatePromises);

        // Kích hoạt các mã giảm giá có thể hoạt động
        const discountsToActivate = await Discount.find({
            startDate: { $lte: currentDate },
            endDate: { $gte: currentDate },
            quantity: { $gt: 0 },
            status: false,
        });
        const activatePromises = discountsToActivate.map((discount) => {
            discount.status = true;
            return discount.save();
        });
        await Promise.all(activatePromises);
    }


    // Phương thức cho HTTP request
    public async updateDiscountStatus(req: Request, res: Response) {
        try {
            // const idUser = await Users.findById(req.params.id);
            // console.log('req',req.body)
            // console.log('idUser',idUser)
            // if(!idUser){
            //  return   res.status(401).json({ success: false, message: 'Không tìm thấy user' });
            // }
            await DiscountController.updateDiscountStatuses(); // Gọi hàm đã tách
            res.status(200).json({ success: true, message: 'Cập nhật trạng thái thành công' });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái', error });
        }

    }
    public async updateDiscount(req: Request, res: Response) {
        try {
            const idUser = await Users.findById(req.body.idUser);
            const startDate = req.body.startDate ? new Date(req.body.startDate).toISOString() : null;
            const endDate = req.body.endDate ? new Date(req.body.endDate).toISOString() : null;
            const idDiscount = await Discount.findById(req.params.id);
            if(!idUser) {
                res.status(400).json({
                    success: false,
                    message: 'IdUser không tìm thấy',
                });
            }
            if (idDiscount !== null) {
                const discountData = {
                    ...req.body,
                };
                if ('idUser' in discountData) {
                    delete discountData.idUser;
                }

                if (endDate) {
                    discountData.endDate = endDate;
                }
                if (startDate) {
                    discountData.startDate = startDate;
                }
                const updatedDiscount = await Discount.findByIdAndUpdate(
                    idDiscount,
                    discountData,
                    { new: true }
                );
                await DiscountController.updateDiscountStatuses();
                res.status(200).json(updatedDiscount);
            } 
        } catch (error) {
            res.status(500).json({ success: false, message: 'Không thể cập nhật Discount', error });
        }
    }

    // Xóa Discount theo ID
    public async deleteDiscount(req: Request, res: Response) {
        try {
            const discountId = req.params.id;
            const idUser = Users.findOne({ idDiscount: req.params.id })
            if (idUser === null) {
                res.status(404).json({ success: true, message: 'Không tìm thấy user' });
            }
            await Users.updateMany({ idDiscount: req.params.id }, { $pull: { idDiscount: req.params.id } });
            const deletedDiscount = await Discount.findByIdAndDelete(discountId);
            if (deletedDiscount) {
                res.status(200).json({ success: true, message: 'Xóa Discount thành công' });
            } else {
                res.status(404).json({ success: false, message: 'Không tìm thấy Discount' });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Không thể xóa Discount', error });
        }
    }
}
