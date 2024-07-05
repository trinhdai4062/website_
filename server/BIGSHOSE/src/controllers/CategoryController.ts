
import { Request, Response } from "express"
import Category, { ICategory } from "../models/Category"
import Shose, { IShose } from "../models/Shose";
import { status } from "../utils/Nocatification";
import { stringToSlug } from "../utils/Confixfont";
export class CategoryController {
    public async ALL_CATEGORI(req: Request, res: Response) {
        try {

            const catery: ICategory[] = await Category.find();
            status(res, true, catery)
        } catch (err) {
            status(res, false, "Categori not found")
        }
    }
    public async CREATE_CATEGORI(req: Request, res: Response) {
        try {
            const newcateri: ICategory = req.body;
            const newslug = stringToSlug(newcateri.name);
            const categri: ICategory = new Category({
                ...newcateri,
                slug: newslug
            });
            await categri.save();
            status(res, true, categri)
        } catch (err) {
            status(res, false,err)
        }
    }
    public async AN_CATEGORI(req: Request, res: Response) {
        try {
            const findidCate = await Category.findById(req.params.id);
            if (findidCate !== null) {
                if (findidCate.parentShose !== null) {
                    const categori = await Category.findById(req.params.id).populate("parentShose");
                    res.status(200).json(categori);
                } else {
                    res.status(200).json(findidCate);
                }
            } else {
                status(res, false, "Id Shose not found");
            }
        } catch (err) {
            res.status(500).json({ status: false, message: err });
        }
    }
    public async UPDATE_CATEGORI(req: Request, res: Response) {
        try {
            const categori = await Category.findById(req.params.id);
            const findshose = await Shose.findById(req.body.parentShose);
            const newCategori = new Category(req.body);
            // const { parentShose,name, ...temp } = newCategori.toObject();
            // console.log('req.body',req.body)
            if (categori) {
                if (newCategori.name) {
                    await categori.updateOne({ $set: {name:newCategori.name, slug: stringToSlug(req.body.name) } })
                }
                if (findshose) {
                    await categori.updateOne({ $addToSet: { parentShose: req.body.parentShose } })
                    await findshose.updateOne({ $set: { parentCategory: req.params.id } })
                }
                await categori.updateOne({$set:{
                    description:newCategori.description,
                    numberOfProducts:newCategori.numberOfProducts,
                    image:newCategori.image,
                    updatedAt:newCategori.updatedAt} })
                status(res, true, "Update successfully")

            }  else {
                status(res, true, "Id category not found!")

            }
        } catch (err) {
            status(res, false, err)

        }
    }
    public async DELETE_CATEGORI(req: Request, res: Response) {
        try {
            const deletes = await Category.findById(req.params.id);
            deletes ? (
                await Shose.updateMany({ parentCategory: req.params.id }, { parentCategory: null }),
                await Category.findByIdAndDelete(req.params.id),
                status(res, true, "Delete successfully!")) :
                status(res, true, "Id category not found!")
        } catch (err) {
            status(res, false, err)
        }
    }


}