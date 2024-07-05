
import { Request, Response } from "express"
import UserProduct, { IUserProduct } from "../models/UserProduct"
import Shose, { IShose } from "../models/Shose";
import { status } from "../utils/Nocatification";
import { stringToSlug } from "../utils/Confixfont";
import Users from "../models/Users";

export class UserProductController {
    public async ALL_USER_PRODUCT(req: Request, res: Response) {
        try {

            const userProducts: IUserProduct[] = await UserProduct.find();
            status(res, true, userProducts)
        } catch (err) {
            status(res, false, "Categori not found")
        }
    }
    public async CREATE_USER_PRODUCT(req: Request, res: Response) {
        try {
            const { userId, productId } = req.body;
            const findUserId = await Users.find({ email: userId });
            if (!findUserId) {
                return res.status(404).json({ message: "UserId not found" });
            } else {
                const findProduct = await Shose.findById(productId)
                if (!findProduct) {
                    return res.status(404).json({ message: "Product not found" });
                }
                const userNew: IUserProduct = new UserProduct({ userId, productId });
                await userNew.save();
                status(res, true, userNew)
            }
        } catch (err) {
            status(res, false, err)
        }
    }
    public async AN_USER_PRODUCT(req: Request, res: Response) {
        try {
            const findidUserProduct: any = await UserProduct.find({ email: req.params.id });
            if (findidUserProduct !== null) {
                if (findidUserProduct.productId !== null) {
                    const userProduct = await UserProduct.find({ email: req.params.id }).populate("productId");
                    res.status(200).json(userProduct);
                } else {
                    res.status(200).json(findidUserProduct);
                }
            } else {
                status(res, false, "Id Shose not found");
            }
        } catch (err) {
            res.status(500).json({ status: false, message: err });
        }
    }
    public async UPDATE_USER_PRODUCT(req: Request, res: Response) {
        try {
            const findUserproduct = await UserProduct.findOne({ userId: req.params.id });
            if (!findUserproduct)  {
                status(res, false, "UserId not found")
            } else {
                const productId=req.body.productId
                const findProduct = await Shose.findById(productId)
                if (!findProduct) {
                    return res.status(404).json({ message: "Product not found" });
                }
                await findUserproduct.updateOne({ userId: req.params.id },{ $set: {productId: productId } })
                status(res, true, "Update successfully")
            }
        } catch (err) {
            status(res, false, err)

        }
    }
    public async DELETE_USER_PRODUCT(req: Request, res: Response) {
        try {
            const deletes = await UserProduct.findOne({userId:req.params.id});
            deletes ? (
                await UserProduct.findByIdAndDelete(deletes._id),
                status(res, true, "Delete successfully!")) :
                status(res, true, "Id userId not found!")
        } catch (err) {
            status(res, false, err)
        }
    }


}