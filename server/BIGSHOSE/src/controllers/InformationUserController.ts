import { Request, Response } from 'express';
import Information, { InformationUser } from '../models/InfomationUser';
import Users from '../models/Users';
import { isParameter } from 'typescript';

export class InformationController {

    static getCleanIpAddress = (ip: string) => {
        if (ip.startsWith("::ffff:")) {
            return ip.substring(7);
            return ip;
        }}
        
    public async getAllInformation(req: Request, res: Response) {
        try {

            const users = await Users.find(); // Tìm tất cả người dùng

            const information = await Information.find({ userId: { $in: users.map(user => user._id) } }); 
            
            const result = information.map((info:any) => {
                const user = users.find((user:any) => user._id.toString() === info.userId.toString()); 
                return {
                    ...info._doc, 
                    image: user ? user.avatar : null 
                };
            });
            console.log(result);
            
            // console.log('information',information)
            // const data={
            //     ...information,
            //     img:
            // }
            
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Không thể lấy danh sách information', error });
        }
    }

    public async createInformation(req: Request, res: Response) {
        try {
            // console.log('req.body',req.body)
            const userId = await Users.findById(req.body.userId);

            if (userId) {
                const ipAddress:any = req.headers['x-forwarded-for']|| req.connection.remoteAddress;
                const cleanIp = InformationController.getCleanIpAddress(ipAddress)
                if(req.body.phone){
                    const phoneExists = await Information.findOne({ phone:req.body.phone });
                    if(phoneExists){
                        res.status(404).json({
                            success: false,
                            message: 'Phone đã tồn tại ',
                        });
                    }
                }

                // console.log('ipAddress', cleanIp)
                const informationData = {
                    ...req.body,
                    userId,
                    ip: cleanIp,
                };
                const newInformation = new Information(informationData);

                // Cập nhật User với thông tin mới
                await userId.updateOne({ $push: { idInformation: newInformation._id } });
                await newInformation.save(); // Lưu vào MongoDB

                res.status(200).json(newInformation); // Trả về dữ liệu mới
            } else {
                res.status(400).json({
                    success: false,
                    message: 'IdUser không tìm thấy',
                });
            }
        } catch (error) {
            console.error('Lỗi khi tạo thông tin:', error);
            res.status(500).json({
                success: false,
                message: 'Không thể tạo thông tin',
                error,
            });
        }
    }
    public async getAnInformation(req: Request, res: Response) {
        try {
            const data = await Information.find({userId:req.params.userId});
            res.status(200).json({ status: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Không thể lấy danh sách information', error });
        }
    }

    public async updateInformation(req: Request, res: Response) {
        try {
            const idInformation:any = await Information.findOne({ userId: req.params.id });
            const ipAddress:any = req.headers['x-forwarded-for']|| req.connection.remoteAddress;
            const cleanIp = InformationController.getCleanIpAddress(ipAddress)
            if (idInformation !== null) {
              
                const updateData = { ...req.body, ip: cleanIp,updatedAt:new Date() };
                if(req.body.userId){
                    delete updateData.userId
                }
                if (updateData.phone) {
                    const phoneExists:any = await Information.findOne({ phone: updateData.phone });
                    if (phoneExists && phoneExists._id.toString() !== idInformation._id.toString()) {
                        return res.status(400).json({
                            success: false,
                            message: 'Phone đã tồn tại',
                        });
                    }
                }
    
                const updatedDiscount = await Information.findByIdAndUpdate(
                    idInformation._id,
                    updateData,
                    { new: true }
                );
                res.status(200).json(updatedDiscount);
            } else {
                res.status(400).json({
                    success: false,
                    message: 'IdUser không tìm thấy',
                });
            }
        } catch (error) {
            res.status(500).json({ success: false, message: 'Không thể cập nhật Discount', error });
        }
    }
    // Xóa Discount theo ID
    public async deleteInformation(req: Request, res: Response) {
        try {
            const discountId = req.params.id;
            const idUser = Users.findOne({ idDiscount: req.params.id })
            if (idUser === null) {
                res.status(404).json({ success: true, message: 'Không tìm thấy user' });
            }
            await Users.updateMany({ idDiscount: req.params.id }, { $pull: { idDiscount: req.params.id } });
            const deletedDiscount = await Information.findByIdAndDelete(discountId);
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
