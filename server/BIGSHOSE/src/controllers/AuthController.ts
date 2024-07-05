import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import Users, { SIGShose } from '../models/Users'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { status } from '../utils/Nocatification';
import mongoose from 'mongoose';

let refreshTokens: string[] = [];
dotenv.config();
export class AuthController {
    static generateAccessToken(user: SIGShose): string {
        return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_ACCESS_KEY!, { expiresIn: "60m" })
    }
    static generateRefreshToken(user: SIGShose): string {
        return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_REFRESH_KEY!, { expiresIn: "365d" })
    }
    static generateRandomString(length: number) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    static async hanldeSenMail(val: any, email: string, subject?: string, text?: string) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: process.env.USER_GMAIL,
                pass: process.env.PASS_GMAIL,
            },
            tls: {
                rejectUnauthorized: false // Vô hiệu hóa xác nhận chứng chỉ (chỉ nên sử dụng trong môi trường phát triển)
            }
        })
        try {
            const infor = await transporter.sendMail({
                from: '"BIGSHOSE 👻"', // sender address
                to: email,
                subject: subject ? subject : "Verification email code ✔",
                text: text ? text : "Your code to verification email", // plain text body
                html: `<h1>${val}</h1>`, // html body
            });

        } catch (err) {
            console.log(`Can not send email ${err}`)
        }
    }
    public async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const sig: SIGShose[] = await Users.find().select('-password');
            res.status(200).json({ status: true, data: sig });

        } catch (error) {
            res.status(500).json({ status: false, message: error });
        }
    }
    public async getAnUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const isObjectId = mongoose.Types.ObjectId.isValid(req.params.email);
            let user: any;

            if (isObjectId) {
                user = await Users.findById(req.params.email).select('-password');
            } else {
                user = await Users.findOne({ email: req.params.email }).select('-password');
            }

            if (user) {
                const populatedFields = ['idPayment', 'idOrder', 'idProduct', 'idDiscount', 'idInformation', 'idNotification'];
                const data = await Users.findById(user._id)
                    .populate(populatedFields.filter((field): any => user[field])) // Chỉ populate trường tồn tại
                    .select('-password');

                res.status(200).json({ status: true, data });
            } else {
                res.status(404).json({ status: false, message: "User not found" });
            }
        } catch (error: any) {
            res.status(500).json({ status: false, message: error.message });
        }
    }


    public async RegisterUser(req: Request, res: Response): Promise<void> {
        const validationRules = [
            // body('username').notEmpty().withMessage('Username is required'),
            body('email').isEmail().withMessage('Invalid email'),
            body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        ];
        await Promise.all(validationRules.map(val => val.run(req)))
        //ckeck validation error\
        const err = validationResult(req);
        if (!err.isEmpty()) {
            return res.status(400).json({ status: false, message: err.array() }) as any;
        }
        try {
            const userData: SIGShose = req.body;
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const userName = (userData.email).split('@')[0];
            const newsig: SIGShose = new Users({
                ...userData,
                username: userName,
                password: hashedPassword,
            });
            await newsig.save();
            const { password, ...others } = newsig.toObject();
            res.status(200).json({ status: true, data: others });
        } catch (error) {
            res.status(500).json({ status: false, message: 'Internal server error.' });
        }
    }
    public async LoginUser(req: Request, res: Response): Promise<void> {
        try {
            const isEmail = (req.body.email).includes('@') && req.body.email;
            let user = isEmail ?
                await Users.findOne({ email: req.body.email }) :
                await Users.findOne({ username: req.body.email })
            let updatnew;
            console.log("log:", isEmail);
            // if(!req.body.deviceToken){
            //     res.status(404).json({ status: false, message: 'Device not found!' });return 
            // }
            if (!user) {
                res.status(404).json({ status: false, message: 'User not found!' }); return
            } else {
                const validPassword = await bcrypt.compare(req.body.password, user.password);
                console.log("validPassword", validPassword)
                if (!validPassword) {
                    res.status(404).json({ status: false, message: 'Incorrect email or password!' }); return;
                }

                // if (user && validPassword) {
                const accessToken = AuthController.generateAccessToken(user);
                const refreshToken = AuthController.generateRefreshToken(user);

                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                })
                console.log('refreshTokenLOGIN', refreshTokens)
                const { password, ...others } = user.toObject(); //tao doi tuong moi ngoai tru password
                // const { password, ...others } =updatnew?updatnew.toObject(): user.toObject(); //tao doi tuong moi ngoai tru password
                res.status(200).json({ status: true, data: others, accessToken });
                // }
            }
        } catch (error) {
            res.status(404).json({ status: false, message: 'Internal server error.' });
        }
    }
    public async UpdateUser(req: Request, res: Response): Promise<void> {
        try {
            const validateEmail = await Users.findOne({ email: req.params.email });
            const userData: SIGShose = req.body;
            // Kiểm tra xem email có tồn tại không
            if (!validateEmail) {
                status(res, false, 'Email is not valid');
                return;
            }

            // Kiểm tra xem mật khẩu cũ có được cung cấp không
            if (validateEmail && userData.password) {
                if (!req.body.passdOld) {
                    status(res, false, 'Old password is not provided');
                    return;
                }

                // So sánh mật khẩu cũ
                const isPasswordMatch = await bcrypt.compare(`${req.body.passdOld}`, validateEmail.password);
                if (!isPasswordMatch) {
                    status(res, false, 'Old password is incorrect');
                    return;
                }
                // Hash mật khẩu mới và cập nhật vào cơ sở dữ liệu
                const hashedPassword = await bcrypt.hash(`${userData.password}`, 10);
                await validateEmail.updateOne({ $set: { password: hashedPassword } });
            }
            if (validateEmail && userData.deviceToken) {
                if (!validateEmail.deviceToken.includes(req.body.deviceToken)) {
                 await validateEmail.updateOne({ $push: { deviceToken: req.body.deviceToken } });
                }
            }

            // Loại bỏ trường password từ userData và cập nhật các trường khác
            const { password,idProduct,idDiscount,idInformation,idOrder,idPayment, ...others } = userData;
            await validateEmail.updateOne({ $set: others });

            status(res, true, others);
        } catch (err) {
            status(res, false, err);

        }
    }

    public async DeleteUser(req: Request, res: Response): Promise<void> {
        try {
            await Users.findByIdAndDelete(req.params.id);
            res.status(200).json({ status: true, message: `User is delete successfully` })

        } catch (error) {
            res.status(500).json({ status: false, message: 'Internal server error.' });
        }
    }
    public async RequestRefreshToken(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken;

        console.log('refreshTokenGDFFD', refreshToken)
        if (!refreshToken) {
            return res.status(401).json({ status: false, message: " You're not authenatited" });
        }
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(401).json({ status: false, message: "Refresh token is not vaild" });
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY!, (err: any, user: any) => {
            if (err) {
                console.log(err);
            } else {
                refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
                //tao moi token 
                const newAccessToken = AuthController.generateAccessToken(user);
                const newRefreshToken = AuthController.generateRefreshToken(user);
                refreshTokens.push(newRefreshToken);
                console.log('refreshTokens', refreshTokens)
                res.cookie("refreshToken", newRefreshToken, {
                    httpOnly: true,
                    secure: true, // Chỉnh sửa thành true nếu sử dụng HTTPS
                    path: "/",
                    sameSite: "strict",
                })
                res.status(200).json({ status: true, newAccessToken });
            }
        })


    }
    public async LogoutUser(req: Request, res: Response) {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter((token) => token !== req.cookies.refreshToken)
        res.status(200).json({ status: true, message: 'Logged out successfully!' });
    }
    public async VerificationUser(req: Request, res: Response) {
        const number = Math.round(10000 + Math.random() * 10000)
        // console.log("number", number)
        await AuthController.hanldeSenMail(number, req.body.email);
        res.status(200).json({ status: true, data: { message: "Send email successfully!!", code: number } });
    }
    public async ForgotPassword(req: Request, res: Response) {
        const passnew = AuthController.generateRandomString(8);
        console.log('passnew', passnew)
        const text = 'Mật khẩu mới của bạn:';
        await AuthController.hanldeSenMail(passnew, req.body.email, text, text);
        const hashedPassword = await bcrypt.hash(passnew, 10);
        const validateEmail = await Users.findOne({ email: req.body.email });
        if (validateEmail) {
            await validateEmail.updateOne({ $set: { password: hashedPassword } })
            status(res, true, "Forgot Password successfully!");
            console.log('Forgot Password successfully')
        } else {
            status(res, false, "Error Forgot Password!");
        }

    }
    public async LoginWidthSocial(req: Request, res: Response) {
        if (req.body) {
            const { email, ...others } = req.body.data;
            const newFace: any = await Users.findOneAndUpdate(
                { email: req.body.data.email },
                { $set: others },
                { returnNewDocument: true, upsert: true })
            const findemail = await Users.findOne({ email: req.body.data.email });
            // console.log('newFace', newFace !== null ? newFace : findemail);
            const accessToken = AuthController.generateAccessToken(newFace !== null ? newFace : findemail);
            const refreshToken = AuthController.generateRefreshToken(newFace !== null ? newFace : findemail);
            refreshTokens.push(refreshToken);
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            })
            res.status(200).json({ status: true, data: newFace !== null ? newFace : findemail, accessToken })

        } else {
            status(res, false, "Hay nhap thong tin")
        }

    }
}
