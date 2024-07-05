// src/server.ts
import express, { Application } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import dotenv from 'dotenv';
import { check, validationResult } from 'express-validator';
import sanitizeHtml, { defaults } from 'sanitize-html';

import shoseRouter from './routers/ShoseRouter';
import authRouter from './routers/AuthRouter'
import categoryRouter from './routers/CategoryRouter';
import imgShoseRouter from './routers/ImgShoseRoute';
import { middlewareController } from './controllers/middlewareController';
import userProduct from './routers/UserProductRouter';
import disscountRouter from './routers/DisscountRouter';
import information from './routers/InformationRouter';
import order from './routers/OrderRouter';
import payment from './routers/PaymentRouter';
import notification from './routers/NotificationRouter';
import conversationRouter from './routers/ConversationsRouter';

import resizeImg from './routers/ResizeImg';
import cronJobs from './cron/Cron';

import path from 'path';
import http from 'http'; 
import { Server as SocketIOServer,Socket } from 'socket.io';  

import messageRouter from './routers/MessageRouter'; 
import Users from './models/Users';
import Messgage from './models/Messgage';


dotenv.config();
class Server {
  public app: Application;
  public server: http.Server;
  public io: SocketIOServer;
  public users: { [key: string]: string } = {}; 
  


  constructor() {
    this.app = express();
    this.server = http.createServer(this.app); 
    this.io = new SocketIOServer(this.server, {
      cors: {
        // origin: ['http://192.168.10.110:6969', 'http://localhost:3000'],
        origin:'*',
        credentials: false
      }
    });
    this.config();
    this.routes();
    this.initializeSockets(); 
    this.connectToDatabase();
    cronJobs;
  }

  private config(): void {
    const allowedTags = sanitizeHtml.defaults.allowedTags.concat(['img', 'video','iframe']);
    const allowedAttributes = {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height'],
      video: ['src', 'controls', 'width', 'height'],
      iframe: ['src', 'allowfullscreen', 'frameborder', 'width', 'height'],
    };

    // Loại bỏ thuộc tính 'script' từ danh sách các thẻ được phép
    const sanitizedAllowedTags = allowedTags.filter(tag => tag !== 'script');
    this.app.use(bodyParser.json({ limit: '50mb' }));
    this.app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
    this.app.use(cookieParser())
    // this.app.use(cors());
    this.app.use(cors({
      // origin: 'http://localhost:3000', 
      // origin: ['http://192.168.10.110:6969', 'http://localhost:3000'],
      origin:'*',
      credentials: true,
    }));
    // this.app.use(
    //   check('fieldName').notEmpty().withMessage('Field is required'),
    // );
    this.app.use((req, res, next) => {
      if (req.body.description && typeof req.body.description === 'string') {
        req.body.description = sanitizeHtml(req.body.description, {
          allowedTags: sanitizedAllowedTags,
          allowedAttributes: allowedAttributes,
        });
        req.body.description = req.body.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        // console.log('Sanitized description:', req.body.description);
      }
      next();
    });
  }
  private routes(): void {
    // this.app.use(middlewareController.verifyToken);
    this.app.use('/v1/auth', authRouter);
    this.app.use('/v1/categori', categoryRouter);
    this.app.use('/v1/shose', shoseRouter);
    this.app.use('/v1/imgshose', imgShoseRouter);
    this.app.use('/v1/userproduct', userProduct);
    this.app.use('/v1/disscount', disscountRouter);
    this.app.use('/v1/information', information);
    this.app.use('/v1/order', order);
    this.app.use('/v1/payment', payment);
    this.app.use('/v1', resizeImg);
    this.app.use('/v1/notification', notification);
    this.app.use('/v1/message', messageRouter);
    this.app.use('/v1/conversation', conversationRouter);
    this.app.use('/images', express.static(path.join(__dirname, '../images')));
    // this.app.use('/v1/uploads/depscription',express.static(path.join(__dirname, '../uploads/depscription')));

  }

  private async connectToDatabase(): Promise<void> {
    try {
      mongoose.connect(process.env.BD_URL2_!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      } as any);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
    }
  }

  private initializeSockets(): void {
    this.io.on('connection', async (socket: Socket) => {
      
      console.log('New client connected:', socket.id);

      socket.on('messageRead', ({ messageId }) => {
        // Xử lý khi tin nhắn đã được đọc, ví dụ như gửi thông báo cho người gửi
        const senderSocketID = Object.values(this.users).find(id => id === socket.id);
        console.log('senderSocketID:', senderSocketID);

        if (senderSocketID) {
          this.io.to(senderSocketID).emit('messageHasBeenRead', { messageId });
          console.log('Message read confirmation sent for message ID:', messageId);
        }
      });
    
      socket.on('register', async (email) => {
        try {
          const user: any = await Users.findOne({ email });
        // console.log('user',user)
          if (!user) {
            console.log(`User with email ${email} not found`);
            return;
          }
          this.users[user.email] = socket.id;
          console.log('User registered:', user.email);
        } catch (error) {
          console.error('Error registering user:', error);
        }
      });

      // socket.on('sendMessage', async (data: { senderEmail: string, receiverEmail: string, message: string }) => {
      //   try {
      //     const { senderEmail, receiverEmail, message } = data;

      //     // Lưu tin nhắn vào MongoDB
      //     const newMessage = new Messgage({
      //       senderEmail,
      //       receiverEmail,
      //       message,
      //     });
      //     await newMessage.save();

      //     // Gửi tin nhắn đến người nhận
      //     const receiverSocketID = this.users[receiverEmail];
      //     if (receiverSocketID) {
      //       this.io.to(receiverSocketID).emit('receiveMessage', { senderEmail, message });
      //       console.log('Message sent from', senderEmail, 'to', receiverEmail);
      //     } else {
      //       console.log('Receiver not connected:', receiverEmail);
      //     }
      //   } catch (error) {
      //     console.error('Error sending message:', error);
      //   }
      // });

      socket.on('disconnect', () => {
        for (let senderEmail in this.users) {
          if (this.users[senderEmail] === socket.id) {
            delete this.users[senderEmail];
            console.log('User disconnected:', senderEmail);
            break;
          }
        }
      });
    });
  }
  // private initializeSockets(): void { 
  //   this.io.on('connection', (socket:Socket) => {
  //     console.log('New client connected:', socket.id);

  //     socket.on('register', (userID) => {
  //       this.users[userID] = socket.id;
  //       console.log('User registered:', userID);
  //     });

  //     socket.on('sendMessage', (data: { senderID: string, receiverID: string, message: string }) => {
  //       const { senderID, receiverID, message } = data;
  //       const receiverSocketID = this.users[receiverID];
  //       if (receiverSocketID) {
  //         this.io.to(receiverSocketID).emit('receiveMessage', { senderID, message });
  //         console.log('Message sent from', senderID, 'to', receiverID);
  //       }
  //       else {
  //         console.log('Receiver not connected:', receiverID);
  //       }
  //     });

  //     socket.on('disconnect', () => {
  //       for (let userID in this.users) {
  //         if (this.users[userID] === socket.id) {
  //           delete this.users[userID];
  //           console.log('User disconnected:', userID);
  //           break;
  //         }
  //       }
  //     });
  //   });
  // }

  public start(port: number): void {
    this.server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  }
}
const serverInstance = new Server();
serverInstance.start(process.env.PORT as any);

export default serverInstance;


// <div dangerouslySetInnerHTML={{ __html: product.description }} />