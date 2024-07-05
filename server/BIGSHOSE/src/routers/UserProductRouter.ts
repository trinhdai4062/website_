import {Router} from 'express'
import { UserProductController } from '../controllers/UserProductController'

const userProduct:Router=Router();
const userProductController:UserProductController=new UserProductController();

userProduct.get('/',userProductController.ALL_USER_PRODUCT);
userProduct.post('/',userProductController.CREATE_USER_PRODUCT);
userProduct.get('/:id',userProductController.AN_USER_PRODUCT);
userProduct.put('/:id',userProductController.UPDATE_USER_PRODUCT);
userProduct.delete('/:id',userProductController.DELETE_USER_PRODUCT);
export default userProduct;