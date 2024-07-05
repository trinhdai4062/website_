import { Router } from 'express';
import { PaymentController } from '../controllers/PaymentController';
import { middlewareController } from '../controllers/middlewareController';
const router = Router();
const paymentController = new PaymentController();


// Định nghĩa các route cho các chức năng CRUD
router.get('/',middlewareController.verifyToken, paymentController.ALL_PAYMENT.bind(paymentController)); // Lấy danh sách
router.post('/',middlewareController.verifyToken, paymentController.CREATE_PAYMENT.bind(paymentController)); // Tạo mới
router.put('/:id',middlewareController.verifyToken, paymentController.UPDATE_PAYMENT.bind(paymentController)); // Cập nhật theo ID
router.delete('/:id',middlewareController.verifyTokenAdminAuth, paymentController.DELETE_PAYMENT.bind(paymentController)); // Xóa theo ID
router.get('/:id',middlewareController.verifyToken, paymentController.AN_PAYMENT.bind(paymentController)); 
// router.get('/description/:description', paymentController.AN_DEPSCRIPTION.bind(paymentController));
export default router;
