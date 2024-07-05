import {Router} from 'express'
import {NocatificationController} from '../controllers/NotificationController'
// import { middlewareController } from '../controllers/middlewareController';

const notificationRouter:Router=Router();
const notificationController:NocatificationController=new NocatificationController();



notificationRouter.get('/devicetoken',notificationController.GET_DEVICE_TOKEN);
notificationRouter.post('/',notificationController.sendNotification);
notificationRouter.post('/news',notificationController.CREATE_NOTIFICATION);
notificationRouter.get('/',notificationController.ALL_NOTIFICATION);
notificationRouter.get('/:id',notificationController.AN_NOTIFICATION);
notificationRouter.delete('/:id',notificationController.DELETE_NOTIFICATION);


export default notificationRouter;