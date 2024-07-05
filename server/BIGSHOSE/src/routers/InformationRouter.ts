import { Router } from 'express';
import { InformationController } from '../controllers/InformationUserController';
import { middlewareController } from '../controllers/middlewareController';
const router = Router();
const informationController = new InformationController();

// Định nghĩa các route cho các chức năng CRUD
router.get('/',middlewareController.verifyToken, informationController.getAllInformation.bind(informationController)); 
router.post('/', informationController.createInformation.bind(informationController)); 
router.get('/:userId',middlewareController.verifyToken, informationController.getAnInformation.bind(informationController)); 
router.put('/:id', informationController.updateInformation.bind(informationController)); 
router.delete('/:id',middlewareController.verifyTokenAdminAuth, informationController.deleteInformation.bind(informationController)); 
// router.put('/update-status', informationController.updateDiscountStatus.bind(informationController)); 

export default router;
