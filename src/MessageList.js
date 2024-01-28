import React from 'react';

const MessageList = ({ messages }) => {
    return (
        <ul>
            {messages.map((message, index) => (
                <li key={index}>
                    <strong>{message.sender}:</strong> {message.text}
                </li>
            ))}
        </ul>
    );
};

export default MessageList;
