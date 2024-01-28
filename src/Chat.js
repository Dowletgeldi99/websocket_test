import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import MessageList from "./MessageList";

const Chat = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io('http://localhost:3001');
        if (!newSocket) return
        console.log({newSocket})
        setSocket(newSocket);

        return () => {
            if (newSocket) newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('message', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
    }, [socket]);

    const sendMessage = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const newMessage = {
                text: message,
                sender: 'user',
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessage('');

            // socket.send('message', newMessage);
            socket.emit('message', newMessage);
        }
    };

    return (
        <div>
            <MessageList messages={messages} />
            <div>
                <input
                    placeholder={'Type your message'}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default Chat;
