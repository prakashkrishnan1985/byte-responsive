import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useDataFlow } from '../providers/FlowDataProvider';

// Define types for the WebSocket message and possible error structure
interface WebSocketMessage {
  action: string;
  orchestration_provision_id: string;
  [key: string]: any; // Allow additional dynamic properties
}

interface WebSocketResponse {
  action: string;
  data: any;
}

interface WebSocketError {
  message: string;
}

// Hook to manage the WebSocket connection and its messages
export const useCompleteExecution = (orchestrationProvisionId: string) => {
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  const { socket, setSocket, message, setMessage, modalOutputIdBy, setModalOutputIdBy } = useDataFlow();
  // const [message, setMessage] = useState<WebSocketResponse | null>(null);
  const [error, setError] = useState<WebSocketError | null>(null);
  const [isSocketOpen, setIsSocketOpen] = useState(false); // State to track WebSocket connection

  // Establish WebSocket connection explicitly
  const connectSocket = useCallback(() => {
    try {
      const socketConnection = new WebSocket(
        `wss://api-hosting-dev.bytesized.com.au/v1/execution/${orchestrationProvisionId}`
      );

      socketConnection.onopen = () => {
        //socketConnection.send("run");
        toast.success("Executed successfully!");
        setIsSocketOpen(true); // Mark socket as open
        console.log('WebSocket connection established and message sent.');
      };

      socketConnection.onmessage = (event) => {
        try {
          const response: WebSocketResponse = JSON.parse(event.data);
          if (typeof response === "object" && response !== null) {
          setMessage(response);
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
        setIsSocketOpen(false); // Mark socket as closed
      };

      setSocket(socketConnection); // Set socket in state
    } catch (err) {
      console.error('Error in WebSocket connection:', err);
      setError({ message: (err as Error).message });
    }
  }, [orchestrationProvisionId]);

  // Send message if socket is connected
  const sendMessage = useCallback((message: any) => {
    if (socket) {
      socket.send(message); // Send a message if the socket is open
    } else {
      setError({ message: 'WebSocket is not open or connected' });
    }
  }, [socket, isSocketOpen]);

  // Disconnect the WebSocket
  const disconnectSocket = useCallback(() => {
    if (socket) {
      socket.close();
      setSocket(null);
      setIsSocketOpen(false); // Mark socket as closed
      console.log('WebSocket connection closed manually.');
    }
  }, [socket]);

  return { message, error, connectFullExecution: connectSocket, disconnect: disconnectSocket, sendMessageFullExecution:sendMessage };
};
