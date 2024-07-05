// src/components/Chat.js
import React, { useEffect, useState } from "react";
import socket from "../../../services/socket";
import { io } from "socket.io-client";
import axios from "axios";
import { base_,baseURL_ } from "../../../utils/env";

const Chat = () => {
  const [message, setMessage] = useState("");
  //   const [chat, setChat] = useState([]);
  const [senderEmail, setSenderEmail] = useState("");
  const [receiverEmail, setReceiverEmail] = useState("");
  const [socket, setSocket] = useState(null);

  const [receivedMessages, setReceivedMessages] = useState([]);

  useEffect(() => {
    // const newSocket = io(`${base_}`);
    const newSocket = io(`http://localhost`);
    setSocket(newSocket);
    newSocket.emit("register", senderEmail);

    //   socket.on('receiveMessage', (data) => {
    //     console.log('Received message:', data);
    //     displayMessage(data.senderEmail, data.message);
    // });

    newSocket.on("receiveMessage", ({ senderEmail, message, messageId,time }) => {
      setReceivedMessages((prevMessages) => [
        ...prevMessages,
        { senderEmail, message, messageId, received: false,time},
      ]);
    });
    newSocket.on("messageHasBeenRead", ({ messageId }) => {
      setReceivedMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.messageId === messageId ? { ...msg, received: true } : msg
        )
      );
    });

    return () => {
      newSocket.disconnect();
    };
  }, [senderEmail]);


  const handleSendMessage = async () => {
    const time = Date.now();
    try {
      const response = await axios.post(
        `${baseURL_}/message/send`,
        { senderEmail, receiverEmail, message }
      );
      console.log("Sent message", response.data.message);
    } catch (error) {
      console.log("error", error);
    }

    if (socket) {
      socket.emit("sendMessage", { senderEmail, receiverEmail, message,time: time });
      setReceivedMessages((prevChat) => [
        ...prevChat,
        { senderEmail, message, time: time, received: false },
      ]);
      setMessage("");
    }
  };
  const sendMessageReadConfirmation = (messageId) => {
    socket.emit("messageRead", { messageId });
  };
  const handleReadConfirmation = (messageId) => {
    // Xử lý sự kiện khi người dùng xác nhận tin nhắn đã đọc
    sendMessageReadConfirmation(messageId);
  };


  return (
    // <div>
    //   <h1>Chat</h1>
    //   <div>
    //     <input
    //       type="text"
    //       placeholder="Your ID"
    //       value={senderEmail}
    //       onChange={(e) => setSenderEmail(e.target.value)}
    //     />
    //     <input
    //       type="text"
    //       placeholder="Receiver ID"
    //       value={receiverEmail}
    //       onChange={(e) => setReceiverEmail(e.target.value)}
    //     />
    //   </div>
    //   <div>
    //     <input
    //       type="text"
    //       placeholder="Message"
    //       value={message}
    //       onChange={(e) => setMessage(e.target.value)}
    //     />
    //     <button onClick={handleSendMessage}>Send</button>
    //   </div>
    //   <div>
    //     {receivedMessages.map((msg, index) => (
    //       <div key={index}>
    //         <strong>{msg.senderEmail}</strong>: {msg.message}{" "}
    //         {msg.received ? "(Read)" : "(Unread)"}
    //         {!msg.received && (
    //           <button onClick={() => handleReadConfirmation(msg.messageId)}>
    //             Mark as Read
    //           </button>
    //         )}
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className="chat-container">
      <div className="chat-messages">
        {receivedMessages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.senderEmail === senderEmail ? "sent-message" : "received-message"
            }`}
          >
            <strong>{msg.senderEmail}</strong>: {msg.message}
            {msg.received ? " (Read)" : " (Unread)"}
            {!msg.received && msg.senderEmail !== senderEmail && (
              <button onClick={() => handleReadConfirmation(msg.messageId)}>Mark as Read</button>
            )}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Your ID"
          value={senderEmail}
          onChange={(e) => setSenderEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Receiver ID"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
