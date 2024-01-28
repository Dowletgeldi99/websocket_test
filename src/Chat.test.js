import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import Chat from './Chat';

import { io } from 'socket.io-client';
import {act} from "react-dom/test-utils";

jest.mock('socket.io-client');

describe('Chat component', () => {
    test('renders correctly', () => {
        render(<Chat />);
        const inputElement = screen.getByPlaceholderText(/Type your message/i);
        const sendButton = screen.getByText(/Send/i);
        expect(inputElement).toBeInTheDocument();
        expect(sendButton).toBeInTheDocument();
    });

    test('sends and receives messages', async () => {
        // Mock the socket instance and its methods
        const mockSocket = {
            on: jest.fn(),
            emit: jest.fn(),
            disconnect: jest.fn(),
            readyState: WebSocket.OPEN,
        };
        io.mockReturnValue(mockSocket);

        render(<Chat />);

        // Simulate user input and message sending
        const inputElement = screen.getByPlaceholderText(/Type your message/i);
        fireEvent.change(inputElement, { target: { value: 'Hello, WebSocket!' } });

        await act(async () => { // Wrap async code in act
            fireEvent.click(screen.getByText(/Send/i));
        });

        // Check if the message is sent
        expect(mockSocket.emit).toHaveBeenCalledWith('message', {
            text: 'Hello, WebSocket!',
            sender: 'user',
        });

        // Simulate receiving a message from the server
        const serverMessage = { text: 'Hello, WebSocket!', sender: 'server' };
        await act(async () => { // Wrap async code in act
            mockSocket.on.mock.calls[0][1](serverMessage);
        });

        // Check if the received message is displayed
        const serverMessageElement = screen.getByText(/server:/i).closest('li');
        expect(serverMessageElement).toBeInTheDocument();
    });
});
