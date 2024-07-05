import { IMGShose, IMGShoseModel } from "../models/ImageShose";
import Shose, { IShose } from '../models/Shose';
import { Response, Request } from "express";
import { status } from "../utils/Nocatification";

export class ImgShoseController {
    public async CREATE_IMG(req: Request, res: Response): Promise<void> {
        try {
            const findidshose = await Shose.findById(req.body.productId);
            // console.log('req.body',req.body)
            if (findidshose) {
                
                const imgShose: IMGShose = new IMGShoseModel(req.body);
                imgShose ?(await imgShose.save(), status(res, true, imgShose)): status(res, false, "Please input data image")
            } else {
                status(res, false, "ID Product not found")
            }
        } catch (error) {
            status(res, false, "Image not create")
        }
    }
    public async ALL_IMG(req: Request, res: Response) {
        try {
            const imgShose = await IMGShoseModel.find();
            imgShose ? status(res, true, imgShose) : status(res, false, "Image not found");
        } catch (error) {
            status(res, false, "Image not found")
        }
    }
    public async AN_IMG(req: Request, res: Response) {
        try {
            const imgShose = await IMGShoseModel.findById(req.params.id).populate('Shose');
            imgShose ? status(res, true, imgShose) : status(res, false, "ID Image not found");
        } catch (error) {
            status(res, false, "Image not found")
        }
    }
    public async UPDATE_IMG(req: Request, res: Response) {
        try {
            const imgShose: any = await IMGShoseModel.findOne({ productId: req.params.id });
            if (!imgShose) {
                return res.status(404).json({ status: false, message: "ID Image not found" });
            }
            if (!req.body.images || !Array.isArray(req.body.images) || req.body.images.length === 0) {
                return res.status(400).json({ status: false, message: "Images not found or invalid format" });
            }
    
            const existingImages = imgShose.images.map((image: any) => image);
            const duplicates = req.body.images.filter((url: string) => existingImages.includes(url));
            // console.log('req.body',req.body.images)
            await imgShose.updateOne({ $set: { images: req.body.images } });
    
            return res.status(200).json({ 
                status: true, 
                message: `Update success. ${duplicates.length > 0 ? "Duplicate images found: " + duplicates.join(', ') : ""}` 
            });
        } catch (error) {
            console.error('Error updating images:', error);
            return res.status(500).json({ status: false, message: "An error occurred while updating images" });
        }
    }    
    public async DELETE_IMG(req: Request, res: Response) {
        try {
            const imgShose = await IMGShoseModel.findByIdAndDelete(req.params.id);
            imgShose ? status(res, true, "Image delete success") : status(res, false, "Image not found");
        } catch (error) {
            status(res, false, "Image not create")
        }
    }
}