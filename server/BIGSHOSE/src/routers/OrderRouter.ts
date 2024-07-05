import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { middlewareController } from '../controllers/middlewareController';
const router = Router();
const orderController = new OrderController();


// Định nghĩa các route cho các chức năng CRUD
router.get('/',middlewareController.verifyToken, orderController.ALL_ORDER.bind(orderController)); // Lấy danh sách
router.post('/',middlewareController.verifyToken, orderController.CREATE_ORDER.bind(orderController)); // Tạo mới
router.put('/:id',middlewareController.authorize, orderController.UPDATE_ORDER.bind(orderController)); // Cập nhật theo ID
router.delete('/:id',middlewareController.verifyTokenAdminAuth, orderController.DELETE_ORDER.bind(orderController)); // Xóa theo ID
router.get('/:id',middlewareController.verifyToken, orderController.AN_ORDER.bind(orderController)); 
router.get('/description/:description',middlewareController.verifyToken, orderController.AN_DEPSCRIPTION.bind(orderController));
export default router;
