// src/controllers/ShoseController.ts
import { Request, Response } from 'express';
import Shose, { IShose } from '../models/Shose';
import Category, { ICategory } from '../models/Category';
import { IMGShose, IMGShoseModel } from '../models/ImageShose';
import { status } from '../utils/Nocatification';
import Users from '../models/Users';
import multer from 'multer';
import xlsx from 'xlsx';
import { ResizeController } from '../controllers/ResizeImgController'
import { AnyArray } from 'mongoose';

// const resizeController:ResizeController=new ResizeController();


export class ShoseController {
    static async processRows(data: any[]): Promise<string[]> {
        let dataIMG = [];
        const Newdata: string[] = [];
        for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
            const row = data[rowIndex];
            // Kiểm tra IMGURL có phải là chuỗi JSON không
            if (typeof row.ARRAY_IMG === 'string') {
                if (row.ARRAY_IMG.startsWith('[') && row.ARRAY_IMG.endsWith(']')) {
                    try {
                        row.ARRAY_IMG = JSON.parse(row.ARRAY_IMG);
                    } catch (error) {
                        console.error('Error parsing IMGURL:', error);
                        continue;
                    }
                } else {
                    row.ARRAY_IMG = [row.ARRAY_IMG];
                }
            }

            if (Array.isArray(row.ARRAY_IMG)) {
                for (let imgIndex = 0; imgIndex < row.ARRAY_IMG.length; imgIndex++) {
                    const imgUrl = row.ARRAY_IMG[imgIndex];
                    try {
                        const imagePath = await ResizeController.downloadImage(imgUrl, imgIndex);
                        dataIMG.push(imagePath);
                        // console.log(`Image downloaded to: ${imagePath}`);
                    } catch (error) {
                        console.error(`Error downloading image at row ${rowIndex}, img ${imgIndex}:`, error);
                    }
                }
            }
            const dataProduct: any = {
                id: row.ID,
                images: dataIMG
            }
            Newdata.push(dataProduct)
            dataIMG = [];

        }
        // console.log('data',Newdata)
        return Newdata;
    }
    public async CREATE_SHOSE(req: Request, res: Response): Promise<void> {
        try {
            const category = await Category.findOne({ _id: req.body.parentCategory });
            const user = await Users.findOne({ email: req.body.userId });
            if (!category) {
                return status(res, false, "Please input a valid parentCategory ID");
            }
            if (!user) {
                return status(res, false, "Please input a valid userID");
            }
            const existingShoe = await Shose.findOne({ name: req.body.name });
            if (existingShoe) {
                return status(res, false, "The shoe with this name already exists.");
            }
            const newShoe: IShose = new Shose({
                ...req.body,
                userId: user._id
            });

            console.log('newShoe', newShoe);

            await Category.updateOne({ _id: req.body.parentCategory }, { $push: { parentShoe: newShoe._id } });
            await user.updateOne({ $push: { idProduct: newShoe._id } });
            const savedShoe = await newShoe.save();
            return status(res, true, savedShoe);
        } catch (err) {
            // Bắt và xử lý lỗi
            console.error('Error:', err);
            return status(res, false, "Internal Server Error");
        }

    }
    public async ALL_SHOSE(req: Request, res: Response): Promise<void> {
        try {
            const shoses: IShose[] = await Shose.find();
            status(res, true, shoses);
        } catch (err) {
            status(res, false, err);
        }
    }
    public async AN_SHOSE(req: Request, res: Response): Promise<void> {
        try {
            const findShoe = await Shose.findById(req.params.id);
            if (findShoe !== null) {
                if (findShoe.parentCategory !== null) {
                    const shoses = await Shose.findById(req.params.id)
                        .populate('parentCategory')
                        .populate({
                            path: 'userId',
                            select: '-password'
                        });
                    // const shoses = await Shose.findById(req.params.id).populate('parentCategory').populate('userId');
                    const imgShose = await IMGShoseModel.find({ productId: req.params.id });
                    res.status(200).json({ status: true, data: shoses, imgShose })
                } else {
                    status(res, true, findShoe);
                }
            } else {
                status(res, false, "Id Shose not found");
            }
        } catch (err) {
            status(res, false, err);
        }
    }
    public async UPDATE_SHOSE(req: Request, res: Response): Promise<void> {
        try {
            const shoses = await Shose.findById(req.params.id);
            if (shoses) {
                if (req.body.userId) {
                    shoses.userId = req.body.userId;
                }
                if (req.body.parentCategory) {
                    const findcategory = await Category.findById(req.body.parentCategory);
                    //vi parentCategory la array len phai kiem tra moi dung duoc includes
                    if (Array.isArray(findcategory?.parentShose)) {
                        const isAlreadyAdded = findcategory.parentShose.includes(req.params.id);
                        if (!isAlreadyAdded) {
                            await findcategory.updateOne({ $push: { parentShose: req.params.id } });
                        } else {
                           return status(res, false, "Shoes already exists in the category");
                        }
                    } else {
                      return  status(res, false, "Category not found ");
                    }
                }
                console.log('req.body',req.body)
                await shoses?.updateOne({ $set: req.body });
               return status(res, true, "Update success")
            } else {
                status(res, false, "Id shose not found");
            }

        } catch (err) {
            status(res, false, err);
        }
    }
    public async DELETE_SHOSE(req: Request, res: Response): Promise<void> {
        try {
            const imgShose = await IMGShoseModel.find({ productId: req.params.id });
            const shoses: any = await Shose.findById(req.params.id);
            const findcategory = await Category.find({ parentShose: req.params.id });
            const findUser = await Users.find({ idProduct: req.params.id });
            if (shoses) {
                if (findcategory) {
                    await Category.updateMany({ parentShose: req.params.id }, { $pull: { parentShose: req.params.id } });
                }
                if (imgShose.length > 0) {
                    await IMGShoseModel.deleteMany({ productId: req.params.id });
                }
                if (findUser) {
                    await Users.updateMany({ idProduct: req.params.id }, { $pull: { idProduct: req.params.id } })
                }
                await Shose.findByIdAndDelete(req.params.id);
                status(res, true, "Delete product success")

            } else {
                status(res, false, "Id shose not found");
            }

        } catch (err) {
            status(res, false, err);
        }
    }
    public async INSERT_FILE(req: Request, res: Response): Promise<void> {
        try {
            if (!req.file) {
                res.status(400).send('No file uploaded');
                return;
            }

            const shoses = await Users.findById(req.params.id);
            if (!shoses) {
                res.status(404).send('User not found');
                return;
            }

            // Xử lý tệp Excel và lưu dữ liệu vào MongoDB
            const workbook = xlsx.readFile(req.file.path);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = xlsx.utils.sheet_to_json(sheet);

            const validData = data.filter((row: any) => row.NAME && row.BRAND && row.PRICE && row.ARRAY_COLOR && row.ARRAY_SIZE && row.QUANTITY && row.DEPSCRIPTION && row.IMAGEURL && row.PARENTCATEGORY && row.ARRAY_IMG);
            // console.log('validData',validData)
            const shoes = await Promise.all(validData.map(async (row: any, index: number) => {
                const imageName = await ResizeController.downloadImage(row.IMAGEURL, index);

                return {
                    userId: shoses._id,
                    name: row.NAME,
                    brand: row.BRAND,
                    price: row.PRICE,
                    color: JSON.parse(row.ARRAY_COLOR),
                    size: JSON.parse(row.ARRAY_SIZE),
                    quantity: row.QUANTITY,
                    description: row.DEPSCRIPTION,
                    imageUrl: imageName,
                    parentCategory: row.PARENTCATEGORY,
                };
            }));

            // console.log('shoes', shoes);

            // Insert dữ liệu giày vào MongoDB
            const productData = await Shose.insertMany(shoes);

            // Xử lý ảnh
            const arrayImg: any = await ShoseController.processRows(validData);
            const imageInsertPromises = productData.map(async (product, index) => {
                const userData = await shoses.updateOne({ $push: { idProduct: product._id } });
                const matchingImages = arrayImg.find((img: any) => img.id === index + 1)?.images || [];
                const image = new IMGShoseModel({
                    productId: product._id,
                    images: matchingImages
                });
                return image.save();
            });

            await Promise.all(imageInsertPromises);

            res.send('Data inserted successfully');
        } catch (error: any) {
            console.error('Error inserting data:', error.message);
            res.status(500).send(`Internal Server Error ${error.code}`);
        }
    }

}