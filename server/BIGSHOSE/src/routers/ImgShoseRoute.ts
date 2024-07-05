import { Router } from "express";
import { ImgShoseController } from "../controllers/ImgShoseController";
import { middlewareController } from '../controllers/middlewareController';

const imgShoseRouter:Router=Router();
const imgShoseController:ImgShoseController=new ImgShoseController();


imgShoseRouter.get('/',imgShoseController.ALL_IMG)
imgShoseRouter.post('/',middlewareController.verifyToken,imgShoseController.CREATE_IMG)
imgShoseRouter.get('/:id',middlewareController.verifyToken,imgShoseController.AN_IMG)
imgShoseRouter.put('/:id',middlewareController.verifyToken,imgShoseController.UPDATE_IMG)
imgShoseRouter.delete('/:id',middlewareController.verifyTokenAdminAuth,imgShoseController.DELETE_IMG)

export default imgShoseRouter;