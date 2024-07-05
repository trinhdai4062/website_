import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { status } from '../utils/Nocatification';
import mongoose from 'mongoose';
import axios from 'axios';
// import admin from 'firebase-admin';
import { JWT } from 'google-auth-library';
import { promises as fs } from 'fs';
import path from 'path';
import Notification, { INotification } from '../models/Notification';
import Users from '../models/Users';
import { convertVietnamTimeToUTC } from '../utils/Confixfont'
import admin from './adminConfig'
import cron from 'node-cron';
dotenv.config();

const SERVICE_ACCOUNT_FILE = path.join(__dirname, '../../uploads/bigshose-f812.json'); // Adjust the path
const PROJECT_ID = 'bigshose';

export class NocatificationController {
  static async getAccessToken(): Promise<void> {
    try {
      const SCOPES = ['https://www.googleapis.com/auth/cloud-platform'];
      const keyFile = await fs.readFile(SERVICE_ACCOUNT_FILE, 'utf8');
      const key = JSON.parse(keyFile);

      const jwtClient = new JWT(
        key.client_email,
        undefined,
        key.private_key,
        SCOPES
      );

      return new Promise((resolve, reject) => {
        jwtClient.authorize((err, tokens: any) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(tokens?.access_token || '');
        });
      });
    } catch (error: any) {
      throw new Error(`Failed to get access token: ${error.message}`);
    }
  }
  // static async ConfigAdmin(): Promise<void> {
  //     admin.initializeApp({
  //         credential: admin.credential.cert(SERVICE_ACCOUNT_FILE),
  //       });
  //     const db = admin.firestore();
  //     const snapshot = await db.collection('topics').get();
  //     const topics: string[] = [];
  //     snapshot.forEach(doc => {
  //         topics.push(doc.id);
  //     });
  //     // const response = await admin.messaging().listTopics();
  //     // const topics = response.topics;
  //     console.log('topics', topics);
  // }
  public async sendNotification(req: Request, res: Response): Promise<Response<any>>  {
    try {
      const { token, tokens, topic, title, body, imageUrl,scheduleTime } = req.body;
      const accessToken: any = await NocatificationController.getAccessToken();
      console.log('req.body', req.body);
      console.log('accessToken', accessToken);

      let message: any = {
        notification: {
          title: title,
          body: body,
        }
      };

      if (imageUrl) {
        message.android = { notification: { imageUrl: imageUrl } };
        message.apns = {
          payload: {
            aps: {
              alert: {
                title: title,
                body: body,
                'mutable-content': 1
              },
              'media-url': imageUrl,
              sound: 'default',
            },
          },
        };
        message.webpush = {
          notification: {
            image: imageUrl
          }
        };
      }

      const scheduledDate = new Date(scheduleTime);
      if (isNaN(scheduledDate.getTime())) {
        return res.status(400).json({ error: 'Invalid schedule time format.' });
      }
      console.log('scheduledDate',scheduledDate)
      const now = new Date();
      console.log('now',now)
      const delay = scheduledDate.getTime() - now.getTime();
      console.log('delay',delay)
      if (delay <= 0) {
        return res.status(400).json({ error: 'Schedule time must be in the future.' });
      }

      setTimeout(async () => {
        let response;
    
        try {
          if (token) {
            message.token = token;
            response = await admin.messaging().send(message);
          } else if (tokens && tokens.length > 0) {
            message.tokens = tokens;
            response = await admin.messaging().sendMulticast(message);
          } else if (topic && topic.trim() !== '') {
            message.topic = topic;
            response = await admin.messaging().send(message);
          } else {
            console.error('No valid target specified (token, tokens, or topic).');
            return;
          }
          console.log('Notification sent:', response);
        } catch (error:any) {
          console.error('Error sending notification:', error);
    
          if (error.errorInfo && error.errorInfo.code === 'messaging/registration-token-not-registered') {
            console.error('Token đăng ký không còn hợp lệ. Đang xóa khỏi cơ sở dữ liệu.');
            
            // Xóa token không hợp lệ khỏi cơ sở dữ liệu
            if (token) {
              await Users.updateMany({ deviceToken: token }, { $pull: { deviceToken: token } });
            } else if (tokens && tokens.length > 0) {
              tokens.forEach(async (i:any) => {
                await Users.updateMany({ deviceToken: i }, { $pull: { deviceToken: i } });
              });
            }
          }
        }
      }, delay);





      // let response: any;
      // if (token) {
      //   message.token = token;
      //   response = await admin.messaging().send(message);
      // } else if (tokens && tokens.length > 0) {
      //   message.tokens = tokens;
      //   response = await admin.messaging().sendMulticast(message);
      // } else if (topic && topic.trim() !== '') {
      //   message.topic = topic;
      //   response = await admin.messaging().send(message);
      // } else {
      //   return res.status(400).json({ error: 'No valid target specified (token, tokens, or topic).' });
      // }

      // return res.status(200).json({ success: true, response: response });
      return res.status(200).json({ success: true, message: 'Notification scheduled successfully.' });

    } catch (error) {
      console.error('Error sending notification:', error);
      return res.status(500).json({ error: 'Failed to send notification' });
    }
  }


  public async CREATE_NOTIFICATION(req: Request, res: Response): Promise<any> {
    try {
      const { token, tokens, topic, title, body, imageUrl,scheduleTime } = req.body;
      console.log('req.body', req.body);
      const user = await Users.findById(req.body.userId);
      if (!user) {
        return res.status(400).json({ error: 'Không tìm thấy userId' });
      }
      let message: any = {
        notification: {
          title: title,
          body: body,
        }
      };

      if (imageUrl) {
        message.android = { notification: { imageUrl: imageUrl } };
        message.apns = {
          payload: {
            aps: {
              alert: {
                title: title,
                body: body,
                'mutable-content': 1
              },
              'media-url': imageUrl,
              sound: 'default',
            },
          },
        };
        message.webpush = {
          notification: {
            image: imageUrl
          }
        };
      }
      const scheduledDate = new Date(scheduleTime);
      if (isNaN(scheduledDate.getTime())) {
        return res.status(400).json({ error: 'Invalid schedule time format.' });
      }
      const now = new Date();
      const delay = scheduledDate.getTime() - now.getTime();
      console.log('delay',delay)

      if (delay <= 0) {
        return res.status(400).json({ error: 'Schedule time must be in the future.' });
      }
      const newNotification: INotification = new Notification({...req.body});
      await user?.updateOne({ $push: { idNotification: newNotification._id } })
      const saveShose = await newNotification.save();
      // console.log('newNotification',newNotification);
      // console.log('saveShose',saveShose);
      // const accessToken: any = await NocatificationController.getAccessToken();

      setTimeout(async () => {
        let response: any;
        try{
          if (token) {
            message.token = token;
            response = await admin.messaging().send(message);
          } else if (tokens && tokens.length > 0) {
            message.tokens = tokens;
            response = await admin.messaging().sendMulticast(message);
          } else if (topic && topic.trim() !== '') {
            message.topic = topic;
            response = await admin.messaging().send(message);
          } else {
            console.error('No valid target specified (token, tokens, or topic).');
            return;
          }
          if (response) {
            const messageId = response.split('/')[3]; 
            console.log('Notification sent successfully with message ID:', messageId);
            // Cập nhật trạng thái thông báo thành đã gửi (status = 1)
            const updatedNotification = await Notification.findById(newNotification._id);
            if (updatedNotification) {
              await updatedNotification.updateOne({ $set: { status: 1 } });
              console.log('Notification status updated.');
            } else {
              console.error('Failed to find notification to update status.');
            }
          } else {
            console.error('Failed to send notification.');
          }
        }catch(error:any){
          console.error('Error sending notification:', error);
          if (error.errorInfo && error.errorInfo.code === 'messaging/registration-token-not-registered') {
            console.error('Token đăng ký không còn hợp lệ. Đang xóa khỏi cơ sở dữ liệu.');
            
            // Xóa token không hợp lệ khỏi cơ sở dữ liệu
            // Xóa token không hợp lệ khỏi cơ sở dữ liệu
            if (token) {
              await Users.updateMany({ deviceToken: token }, { $pull: { deviceToken: token } });
            } else if (tokens && tokens.length > 0) {
              for (const invalidToken of tokens) {
                await Users.updateMany({ deviceToken: invalidToken }, { $pull: { deviceToken: invalidToken } });
              }
            }
          }
        }
        console.log('Notification sent:', response);

      }, delay);
      return res.status(200).json({ success: true, message: 'Notification scheduled successfully.' });

    } catch (error) {
      console.error('Error sending notification:', error);
      return res.status(500).json({ error: 'Failed to send notification' });
    }
  }
  public async ALL_NOTIFICATION(req: Request, res: Response): Promise<void> {
    try {
      const shoses: INotification[] = await Notification.find();
      status(res, true, shoses);
    } catch (err) {
      status(res, false, err);
    }
  }
  public async GET_DEVICE_TOKEN(req: Request, res: Response): Promise<void> {
    try {
      const data = await Users.find().select('email deviceToken');
      // console.log('data', data)
      res.status(200).json(data);
    } catch (error) {
      res.status(500).send('Error getting topics: ' + error);
    }
  }
  public async AN_NOTIFICATION(req: Request, res: Response): Promise<void> {
    try {
      const notification = await Notification.findOne({userId:req.params.id});
      if (notification !== null) {
        status(res, true, notification);
    } else {
        status(res, false, "Id not found");
    }
    } catch (err) {
      status(res, false, err);
    }  
  }
  // public async UPDATE_ORDER(req: Request, res: Response): Promise<void> {
  //     try {
  //         const order = await Order.findById(req.params.id);
  //         if (order && req.body.status) {

  //             const update = {
  //                 status: req.body.status,
  //                 updatedAt: new Date()
  //             };
  //             await order.updateOne({ $set: update });
  //             status(res, true, "Update success")
  //         } else {
  //             status(res, false, "Id order not found");
  //         }

  //     } catch (err) {
  //         status(res, false, err);
  //     }
  // }
  public async DELETE_NOTIFICATION(req: Request, res: Response): Promise<void> {
      try {
          const notification: any = await Notification.findById(req.params.id);
          const findUser = await Users.find({ idNotification: req.params.id });
          if (notification) {
              if (findUser) {
                  await Users.updateMany({ idNotification: req.params.id }, { $pull: { idNotification: req.params.id } });
              }
              await Notification.findByIdAndDelete(req.params.id);
              status(res, true, "Delete notification success")
          } else {
              status(res, false, "Id notification not found");
          }
      } catch (err) {
          status(res, false, err);
      }
  }




}
