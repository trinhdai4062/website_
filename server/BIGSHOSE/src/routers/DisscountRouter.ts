import { Router } from 'express';
import { DiscountController } from '../controllers/DisscountController';
import { middlewareController } from '../controllers/middlewareController';
const router = Router();
const discountController = new DiscountController();

// Định nghĩa các route cho các chức năng CRUD
router.get('/',middlewareController.verifyToken, discountController.getAllDiscounts.bind(discountController)); // Lấy danh sách
router.post('/',middlewareController.verifyToken, discountController.createDiscount.bind(discountController)); // Tạo mới
router.put('/:id',middlewareController.verifyToken, discountController.updateDiscount.bind(discountController)); // Cập nhật theo ID
router.delete('/:id',middlewareController.verifyTokenAdminAuth, discountController.deleteDiscount.bind(discountController)); // Xóa theo ID
router.put('/update-status/:id',middlewareController.verifyToken, discountController.updateDiscountStatus.bind(discountController)); // Cập nhật trạng thái

export default router;
