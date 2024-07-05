// src/routers/MessageRouter.ts
import { Router } from 'express';
import { SEND_MESSAGE,ALL_MESSAGE,getMessagesByEmail,AN_MESSAGE } from '../controllers/MessageController';
import { middlewareController } from '../controllers/middlewareController';

const routerMessage: Router = Router();

routerMessage.post('/send', SEND_MESSAGE);
routerMessage.get('/', ALL_MESSAGE);
// routerMessage.post('/:id', getMessagesByEmail);
routerMessage.get('/:id', AN_MESSAGE);

export default routerMessage;
