import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useDataFlow } from '../providers/FlowDataProvider';

interface WebSocketMessage {
  action: string;
  orchestration_provision_id: string;
  [key: string]: any;
}

interface WebSocketResponse {
  action: string;
  data: any;
}

interface WebSocketError {
  message: string;
}

interface ChatMessage {
  message: string;
}

interface DeleteMessage {
  delete_chat_id: string;
}

interface TokenMessage {
  token: string;
}

export const useChat = (chatId: string, token: string) => {
  const { socket, setSocket, message, setMessage } = useDataFlow();
  const [error, setError] = useState<WebSocketError | null>(null);
  const [isSocketOpen, setIsSocketOpen] = useState(false);

  // Establish WebSocket connection
  const connectSocket = useCallback(() => {
    try {
      const socketConnection = new WebSocket(
        `wss://api-hosting-dev.bytesized.com.au/v1/chat/${chatId}`
      );

      socketConnection.onopen = () => {
        const tokenMessage: TokenMessage = { token };
        socketConnection.send(JSON.stringify(tokenMessage));
        toast.success("Chat session started!");
        setIsSocketOpen(true);
        console.log('WebSocket connection established and token sent.');
      };

      socketConnection.onmessage = (event) => {
        try {
          const response: WebSocketResponse = JSON.parse(event.data);
          if (typeof response === "object" && response !== null) {
            setMessage(response);
          }
          else if (typeof response === "string" && response !== null) {
            toast.success(response);
          }
        } catch (e) {
          console.error('Error parsing WebSocket response:', e);
        }
      };

      socketConnection.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError({ message: (error as any).message });
        socketConnection.close();
      };

      socketConnection.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        setIsSocketOpen(false);
      };

      setSocket(socketConnection);
    } catch (err) {
      console.error('Error in WebSocket connection:', err);
      setError({ message: (err as Error).message });
    }
  }, [chatId, token]);

  // Send message
  const sendMessage = useCallback((messageText: string) => {
    if (socket) {
      const message: ChatMessage = { message: messageText };
      socket.send(JSON.stringify(message)); 
    } else {
      setError({ message: 'WebSocket is not open or connected' });
    }
  }, [socket]);

  // Delete message
  const deleteMessage = useCallback((deleteChatId: string) => {
    if (socket) {
      const deleteMessagePayload: DeleteMessage = { delete_chat_id: deleteChatId };
      socket.send(JSON.stringify(deleteMessagePayload));
    } else {
      setError({ message: 'WebSocket is not open or connected' });
    }
  }, [socket]);

  // Disconnect WebSocket
  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
      setIsSocketOpen(false);
      console.log('WebSocket connection closed manually.');
    }
  }, [socket]);

  return {
    message,
    error,
    connectChat: connectSocket,
    disconnect: disconnectSocket,
    sendMessageToChat: sendMessage,
    deleteMessageFromChat: deleteMessage,
  };
};
