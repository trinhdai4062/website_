import { Request, Response, NextFunction } from 'express';
import Users, { SIGShose } from '../models/Users'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
// import  {DisscountController } from '../controllers/DisscountController'


// const updateDisscount:DisscountController=new DisscountController();

dotenv.config();
interface CustomRequest extends Request {
    user?: SIGShose; // Thêm thuộc tính user vào Request
}
export class middlewareController {

    // Thực hiện logic xử lý middleware ở đây
    static verifyToken = (req: CustomRequest, res: Response, next: NextFunction) => {
        const token = req.headers['token'];
        if (typeof token === 'string') {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY!, (err, decoded) => {
                if (err) {
                    return res.status(403).json({ status: false, messgae: "Token is not valid" })
                } else {
                    req.user = decoded as SIGShose;
                    return next()
                }
                next();
            })

        } else {
            return res.status(401).json("You're not authenticated")
        }
    }
    static verifyTokenAdminAuth = (req: CustomRequest, res: Response, next: NextFunction) => {
        middlewareController.verifyToken(req, res, () => {
            if (req.user && (req.user.id == req.params.id || req.user.role === 'admin')) {
                next();
            }
            else {
                return res.status(403).json({ status: false, message: "You're not allowed to delete other" })
            }
        });
    }
    // static updateDiscountStatusMiddleware= async(req:CustomRequest, res: Response, next: NextFunction)=>{
    //     try {
    //         await updateDisscount.updateDiscountStatus;
    //         next();
    //     } catch (error) {
    //         console.error('Error updating discount status:', error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }

    // }

    // static getIpMiddleware = (req: Request, res: Response, next: NextFunction) => {
    //     // Sử dụng 'x-forwarded-for' nếu chạy sau proxy, nếu không thì dùng 'remoteAddress'
    //     const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    //     if (Array.isArray(ipAddress)) {
    //         req.userIp = ipAddress[0]; // Nếu là mảng, lấy địa chỉ đầu tiên
    //     } else {
    //         req.userIp = ipAddress;
    //     }

    //     next();
    // };

    static authorize = (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization; // Lấy tiêu đề Authorization
        // console.log('Authorization Header:', req.headers.authorization); 
        if (!authHeader) {
            // Nếu không có tiêu đề Authorization
            res.status(401).json({ success: false, message: 'Authorization header is missing' });
            return;
        }

        // Giả sử tiêu đề là 'Bearer <token>'
        const token = authHeader.split(' ')[1]; // Lấy phần sau "Bearer"

        // Kiểm tra token (bạn có thể thay bằng cơ chế xác thực khác)
        const validToken = process.env.TOKEN_STATUS_ORDER; 

        if (token !== validToken) {
            // Nếu token không hợp lệ
            res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
            return;
        }

        // Nếu token hợp lệ, tiếp tục xử lý yêu cầu
        next(); // Chuyển điều khiển đến hàm tiếp theo
    }

};

