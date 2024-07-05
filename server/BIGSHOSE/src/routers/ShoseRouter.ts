import {Router} from 'express'
import { ShoseController } from '../controllers/ShoseController'
import multer from 'multer';
import xlsx from 'xlsx';
import { middlewareController } from '../controllers/middlewareController';

const shoseRouter:Router=Router();
const shoseController:ShoseController=new ShoseController();

// Thiết lập multer để lưu tệp Excel tải lên
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });
// console.log('upload',upload)

shoseRouter.get('/',shoseController.ALL_SHOSE);
shoseRouter.post('/',middlewareController.verifyToken,shoseController.CREATE_SHOSE);
shoseRouter.get('/:id',middlewareController.verifyToken,shoseController.AN_SHOSE);
shoseRouter.put('/:id',middlewareController.verifyToken,shoseController.UPDATE_SHOSE);
shoseRouter.delete('/:id',middlewareController.verifyTokenAdminAuth,shoseController.DELETE_SHOSE);
shoseRouter.post('/upload/:id',upload.single('excelFile'),shoseController.INSERT_FILE);
export default shoseRouter;