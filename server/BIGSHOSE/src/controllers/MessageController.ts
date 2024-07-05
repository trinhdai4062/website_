// src/controllers/MessageController.ts
import { Request, Response } from 'express';
import Users from '../models/Users';
import Message, { IMessage } from '../models/Messgage';
import serverInstance from '../server';
import { MessageChannel } from 'worker_threads';
import Conversation from '../models/Conversations';
import Conversations from '../models/Conversations';

export const SEND_MESSAGE = async (req: Request, res: Response) => {
    const { senderEmail, receiverEmail, message } = req.body;
    try {
        console.log('req.body', req.body)
        const receiver = await Users.findOne({ email: receiverEmail });
        const sender = await Users.findOne({ email: senderEmail });

        if (!receiver || !sender) {
            return res.status(404).json({ error: 'Sender or Receiver not found' });
        }
        const conversationName1 = `${senderEmail.toLowerCase()}_${receiverEmail.toLowerCase()}`;
        const conversationName2 = `${receiverEmail.toLowerCase()}_${senderEmail.toLowerCase()}`;
        let conversation: any = await Conversation.findOne({
            $or: [
                { name: conversationName1 },
                { name: conversationName2 }
            ]
        });

        if (!conversation) {
            conversation = new Conversation({ name: conversationName1 });
            await conversation.save();
            await sender.updateOne({ $push: { idConversation: conversation._id } });
            await receiver.updateOne({ $push: { idConversation: conversation._id } });
        }
        console.log('conversation', conversation)
        const newMessage = new Message({
            idConversation: conversation._id,
            senderEmail,
            receiverEmail,
            message
        });
        await newMessage.save();
        console.log('newMessage', newMessage)
        await conversation?.updateOne({ $push: { messageId: newMessage._id } })

        // console.log('newMessage', newMessage)
        // console.log('newConversations', conversation)

        const receiverSocketId = serverInstance.users[receiver.email];
        const numberOfUsers = Object.keys(serverInstance.users).length;
        console.log('Number of users:', numberOfUsers);

        if (receiverSocketId) {
            serverInstance.io.to(receiverSocketId).emit('receiveMessage', {
                senderEmail,
                message,
                messageId: newMessage._id,
                time: newMessage.timestamp
            });
        } else {
            await Message.create({ idConversation: conversation._id, senderEmail, receiverEmail, message });
        }

        // await Conver.deleteMany({})
        // await Message.deleteMany({})

        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
export const ALL_MESSAGE = async (req: Request, res: Response) => {

    try {
        const mess: IMessage[] = await Message.find();
        res.status(200).json({ data: mess });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const AN_MESSAGE = async (req: Request, res: Response) => {
    const idConversation = req.params.id;
    try {
        const mess: IMessage[] = await Message.find({ idConversation: idConversation }).sort({ timestamp: 'desc' });
        if (mess) {
            res.status(200).json({ data: mess });
        } else {
            res.status(404).json({ message: 'idConversation not found' });
        }


    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getMessagesByEmail = async (req: Request, res: Response) => {
    const senderEmail = req.params.id;
    const receiverEmail = req.body.receiverEmail;
    try {
        if (receiverEmail && senderEmail) {
            // const messages = await Message.find({ receiverEmail }).sort({ timestamp: 'desc' });
            const emails = [`${receiverEmail}`, `${senderEmail}`];
            const messages = await Message.find({
                $or: [
                    { receiverEmail: { $in: emails }, senderEmail: { $in: emails } }
                ]
            }).sort({ timestamp: 'desc' });

            // console.log('messages', messages)
            // Đánh dấu các tin nhắn chưa đọc là đã đọc
            messages.forEach(async (message) => {
                if (!message.read) {
                    message.read = true;
                    await message.save();
                }
            });

            res.status(200).json(messages);
        } else {
            res.status(404).json({ message: 'Failed to not found receiverEmail add senderEmail' });
        }



    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch messages', error });
    }
};
export const messageRead = async (req: Request, res: Response) => {
    const { messageId } = req.body;

    try {
        // Cập nhật trạng thái tin nhắn đã đọc trong cơ sở dữ liệu
        const message = await Message.findById(messageId);
        if (message) {
            message.read = true;
            await message.save();

            // Thông báo cho người gửi rằng tin nhắn đã được đọc
            if (serverInstance.users[message.senderEmail]) {
                serverInstance.io.to(serverInstance.users[message.senderEmail]).emit('messageHasBeenRead', { messageId });
            }

            res.status(200).json({ message: 'Message read status updated' });
        } else {
            res.status(404).json({ error: 'Message not found' });
        }
    } catch (error) {
        console.error('Error updating message read status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


export const AN_CONVERSATION = async (req: Request, res: Response) => {
    // const email  = req.params.id;
    const data: any[] = []
    const user: any = await Users.findOne({ email: req.params.id })
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    try {
        // Lấy các tin nhắn chưa đọc từ cơ sở dữ liệu

        // console.log('user', user.idConversation)
        if (user && user.idConversation.length > 0) {
            for (const conversationId of user.idConversation) {
                const convert: any = await Conversation.findById(conversationId)
                // console.log('convert', convert)
                const newConver = convert.messageId[convert.messageId.length - 1]
                // console.log('newConver', newConver)
                const mes: any = await Message.findById(newConver)

                let receiverUsers: any;
                if (req.params.id === mes.receiverEmail) {
                    receiverUsers = await Users.findOne({ email: mes.senderEmail })
                } else {
                    receiverUsers = await Users.findOne({ email: mes.receiverEmail })
                }
                // console.log('mes', mes)
                // console.log('receiverUsers', receiverUsers.length)
                const newdata = {
                    ...mes.toObject(),
                    name: receiverUsers.fullName ? receiverUsers.fullName : receiverUsers.email,
                    image: receiverUsers.avatar ? receiverUsers.avatar : null,
                };
                // console.log('newdata', newdata)
                data.push(newdata)
            }
        }
        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching unread messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const ALL_CONVERSATION = async (req: Request, res: Response) => {

    try {
        const mess = await Conversation.find();
        res.status(200).json({ data: mess });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};