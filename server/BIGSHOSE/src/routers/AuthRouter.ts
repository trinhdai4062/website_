import {Router} from 'express'
import {AuthController} from '../controllers/AuthController'
import { middlewareController } from '../controllers/middlewareController';

const authRouter:Router=Router();
const authController:AuthController=new AuthController();

authRouter.get('/user',middlewareController.verifyToken,authController.getAllUsers);
authRouter.get('/user/:email',middlewareController.verifyToken,authController.getAnUsers);

authRouter.post('/register',authController.RegisterUser);
authRouter.post('/login',authController.LoginUser);
authRouter.put('/user/:email',middlewareController.verifyToken,authController.UpdateUser);
authRouter.delete('/:id',middlewareController.verifyToken,authController.DeleteUser);
authRouter.post('/refresh',authController.RequestRefreshToken);
authRouter.post('/logout',middlewareController.verifyToken,authController.LogoutUser);
authRouter.post('/verification',authController.VerificationUser);
authRouter.post('/forgotpassword',authController.ForgotPassword);
authRouter.post('/loginsocial',authController.LoginWidthSocial);


export default authRouter;