import {Router} from 'express'
import {ResizeController} from '../controllers/ResizeImgController'
import { middlewareController } from '../controllers/middlewareController';

const resizeRouter:Router=Router();
const resizeController:ResizeController=new ResizeController();

// app.use('/images', express.static(path.join(__dirname, '../images')));

resizeRouter.get('/resize',resizeController.RESIZE_IMG);
resizeRouter.post('/uploads',resizeController.UP_IMG);
resizeRouter.post('/download',resizeController.DOWNLOAD_IMG);
resizeRouter.post('/upload-image',resizeController.UP_IMG_DEPSCRIP);
resizeRouter.post('/upload-video',resizeController.UP_VIDEO_DEPSCRIP);



export default resizeRouter;