import { Router } from "express";
import { CategoryController } from "../controllers/CategoryController";
import { middlewareController } from '../controllers/middlewareController';

const categoryRouter:Router=Router();
const ctoryController:CategoryController=new CategoryController();


categoryRouter.get('/',ctoryController.ALL_CATEGORI)
categoryRouter.post('/',middlewareController.verifyToken,ctoryController.CREATE_CATEGORI)
categoryRouter.get('/:id',middlewareController.verifyToken,ctoryController.AN_CATEGORI)
categoryRouter.put('/:id',middlewareController.verifyToken,ctoryController.UPDATE_CATEGORI)
categoryRouter.delete('/:id',middlewareController.verifyTokenAdminAuth,ctoryController.DELETE_CATEGORI)

export default categoryRouter;