// src/routers/MessageRouter.ts
import { Router } from 'express';
import { ALL_CONVERSATION,AN_CONVERSATION} from '../controllers/MessageController';
import { middlewareController } from '../controllers/middlewareController';

const routerConversations: Router = Router();

// routerMessage.post('/send', sendMessage);
routerConversations.get('/', ALL_CONVERSATION);
routerConversations.get('/:id', AN_CONVERSATION);
// routerMessage.post('/:id', getMessagesByEmail);
// routerMessage.get('/:id', getConversation);

export default routerConversations;
