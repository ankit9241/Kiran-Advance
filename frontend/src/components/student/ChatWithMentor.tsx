import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, API_URL, SOCKET_CONFIG } from '../../config';

// Socket.IO type declarations
declare global {
  interface Window {
    io: {
      (uri?: string, opts?: any): SocketIOClient.Socket;
      reconnect: () => void;
      Manager: any;
    };
  }
  
  namespace SocketIOClient {
    interface Manager {
      on(event: string, callback: (data: any) => void): void;
      reconnect(): void;
      reconnection: {
        (): boolean;
        (v: boolean): Manager;
      };
      reconnectionAttempts: {
        (): number;
        (v: number): Manager;
      };
      reconnectionDelay: {
        (): number;
        (v: number): Manager;
      };
      reconnectionDelayMax: {
        (): number;
        (v: number): Manager;
      };
      timeout: {
        (): number;
        (v: number): Manager;
      };
    }

    interface Socket {
      id: string;
      connected: boolean;
      io: Manager;
      on(event: string, callback: (data: any) => void): void;
      off(event: string, callback?: (data: any) => void): void;
      emit(event: string, ...args: any[]): void;
      disconnect(): void;
      connect(): void;
    }
  }
}

interface ChatWithMentorProps {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

interface Mentor {
  id: string;
  registrationId: string;
  name: string;
  email: string;
  avatar?: string;
  class?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

type MessageType = { 
  id: string;
  sender: 'mentor' | 'student'; 
  text: string; 
  time: string;
};

const mockMentors: Mentor[] = [
  {
    id: '1',
    registrationId: 'MEN2025001',
    name: 'Dr. Sarah Wilson',
    email: 'sarah.wilson@KIRAN.com',
    avatar: '/assets/mentor.png',
    class: 'Computer Science',
    lastMessage: 'Hello! How can I help you today?',
    lastMessageTime: '2024-07-23T14:30:00'
  },
  {
    id: '2',
    registrationId: 'MEN2025002',
    name: 'Prof. James Miller',
    email: 'james.miller@KIRAN.com',
    avatar: '/assets/students.png',
    class: 'Web Development',
    lastMessage: 'Hi! Need help with JavaScript?',
    lastMessageTime: '2024-07-22T10:10:00'
  }
];

const mockChats: Record<string, MessageType[]> = {
  '1': [
    { id: '1', sender: 'mentor', text: 'Hello! How can I help you today?', time: '2024-07-23T14:30:00' },
    { id: '2', sender: 'student', text: 'I have a question about algorithms.', time: '2024-07-23T14:32:00' },
  ],
  '2': [
    { id: '3', sender: 'mentor', text: 'Hi! Need help with JavaScript?', time: '2024-07-22T10:10:00' },
    { id: '4', sender: 'student', text: 'Yes, please explain ES6 features.', time: '2024-07-22T10:12:00' },
  ],
};

const ChatWithMentor: React.FC<ChatWithMentorProps> = ({ user }) => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  
  // State management
  const [mentors, setMentors] = useState<Mentor[]>(mockMentors);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Refs
  const socketRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebSocket connection and event handlers
  const onConnect = useCallback(() => {
    console.log('✅ Connected to WebSocket server');
    setIsConnected(true);
    setError('');
  }, []);

  const onDisconnect = useCallback((reason: string) => {
    console.log('❌ Disconnected from WebSocket server. Reason:', reason);
    setIsConnected(false);
  }, []);

  const onConnectError = useCallback((error: any) => {
    console.error('WebSocket connection error:', error);
    setError('Failed to connect to chat server. Attempting to reconnect...');
    
    // Attempt to reconnect after a delay
    setTimeout(() => {
      if (socketRef.current && !socketRef.current.connected) {
        console.log('Attempting to reconnect...');
        socketRef.current.connect();
      }
    }, 5000);
  }, []);
  
  const onSocketError = useCallback((error: any) => {
    console.error('❌ Socket error:', error);
    setError(`Chat error: ${error.message || 'Unknown error'}`);
  }, []);
  
  // Handle new message from WebSocket
  const onReceiveMessage = useCallback((data: { sender: string; content: string; timestamp: string; message?: string }) => {
    console.log('Received message:', data);
    const sender: 'mentor' | 'student' = data.sender === user?.id ? 'student' : 'mentor';
    const newMessage: MessageType = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      sender,
      text: data.content || data.message || '',
      time: data.timestamp || new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  }, [user?.id]);
  
  // Handle typing status
  const onTypingStatus = useCallback((data: { senderId: string; isTyping: boolean }) => {
    if (data.senderId === selectedMentor?.id) {
      setIsTyping(data.isTyping);
    }
  }, [selectedMentor?.id]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (typeof window === 'undefined' || !window.io) {
      const errorMsg = 'Socket.IO client not available';
      console.error(errorMsg);
      setError('Real-time chat is not available. Please refresh the page or check your connection.');
      return;
    }

    console.log('Initializing Socket.IO connection to base URL:', API_BASE_URL);
    
    try {
      // Create a URL object to parse the base URL
      const baseUrl = new URL(API_BASE_URL);
      const isHttps = baseUrl.protocol === 'https:';
      const wsProtocol = isHttps ? 'wss' : 'ws';
      
      // For WebSocket connection, we want to connect to the root of the server
      const wsUrl = `${wsProtocol}://${baseUrl.host}`;
      
      console.log('WebSocket connection details:', {
        wsUrl,
        baseUrl: API_BASE_URL,
        ...SOCKET_CONFIG,
        // Add auth token if available
        auth: user ? { token: localStorage.getItem('token') } : undefined
      });
      
      // Initialize socket connection with configuration
      const socket = window.io(wsUrl, {
        ...SOCKET_CONFIG,
        withCredentials: true,
        auth: user ? { token: localStorage.getItem('token') } : undefined,
        query: {
          clientType: 'web',
          version: '1.0.0',
          userId: user?.id || 'anonymous',
          userRole: user?.role || 'guest'
        },
        // Force new connection to avoid reusing existing ones
        forceNew: true,
        // Enable debug for development
        debug: process.env.NODE_ENV === 'development',
        // Ensure we're using the correct path
        path: '/socket.io/'
      });
      
      // Debug socket events
      const handleConnect = () => {
        console.log('Socket connected with ID:', socket.id);
        setError(''); // Changed from null to empty string to match SetStateAction<string>
      };
      
      const handleConnectError = (error: any) => {
        console.error('Socket connection error:', error);
        setError(`Connection error: ${error.message}. Trying to reconnect...`);
      };
      
      const handleError = (error: any) => {
        console.error('Socket error:', error);
        setError(`WebSocket error: ${error.message}`);
      };
      
      const handleDisconnect = (reason: string) => {
        console.log('Socket disconnected:', reason);
        if (reason === 'io server disconnect') {
          // The disconnection was initiated by the server, we need to reconnect manually
          socket.connect();
        }
      };
      
      // Set up reconnection event handlers first
      const onReconnect = (attempt: number) => {
        console.log(`✅ Successfully reconnected after ${attempt} attempts`);
        setError('');
        setIsConnected(true);
      };
      
      const onReconnectAttempt = (attempt: number) => {
        console.log(`Attempting to reconnect (${attempt})...`);
        setError(`Attempting to reconnect (${attempt}/5)...`);
      };
      
      const onReconnectError = (error: any) => {
        console.error('Reconnection error:', error);
        setError(`Reconnection failed: ${error.message}`);
        setIsConnected(false);
      };
      
      const onReconnectFailed = () => {
        console.error('❌ Max reconnection attempts reached');
        setError('Unable to connect to chat server. Please refresh the page to try again.');
        setIsConnected(false);
      };

      // Set up event listeners
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('connect_error', handleConnectError);
      socket.on('error', handleError);
      socket.on('receiveMessage', onReceiveMessage);
      socket.on('typing', onTypingStatus);
      
      // Set up reconnection event listeners
      if (socket.io) {
        socket.io.on('reconnect', onReconnect);
        socket.io.on('reconnect_attempt', onReconnectAttempt);
        socket.io.on('reconnect_error', onReconnectError);
        socket.io.on('reconnect_failed', onReconnectFailed);
      }
      
      // Store socket reference
      socketRef.current = socket;
      
      // Cleanup function
      return () => {
        console.log('Cleaning up WebSocket connection');
        
        // Remove all event listeners
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('connect_error', handleConnectError);
        socket.off('error', handleError);
        socket.off('receiveMessage', onReceiveMessage);
        socket.off('typing', onTypingStatus);
        
        // Remove reconnection event listeners
        if (socket.io) {
          socket.io.off('reconnect', onReconnect);
          socket.io.off('reconnect_attempt', onReconnectAttempt);
          socket.io.off('reconnect_error', onReconnectError);
          socket.io.off('reconnect_failed', onReconnectFailed);
        }
        
        // Disconnect if still connected
        if (socket.connected) {
          console.log('Disconnecting socket');
          socket.disconnect();
        }
        
        // Clear socket reference
        socketRef.current = null;
      };
    } catch (error) {
      console.error('Failed to initialize WebSocket connection:', error);
      setError('Failed to initialize chat. Please try again later.');
    }
  }, [user?.id, onConnect, onDisconnect, onConnectError, onSocketError, onReceiveMessage, onTypingStatus]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setIsLoading(true);
        // Use the API_URL which already includes /api/v1
        const mentorsUrl = `${API_URL}/mentors`;
        console.log('Fetching mentors from:', mentorsUrl);
        
        const response = await axios.get(mentorsUrl, {
          withCredentials: true,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          // Add timeout to prevent hanging
          timeout: 10000
        });
        
        console.log('Mentors API response status:', response.status, response.statusText);
        
        // Handle different response formats
        if (response.status === 200) {
          if (Array.isArray(response.data)) {
            // Handle direct array response
            setMentors(response.data);
          } else if (response.data && Array.isArray(response.data.data)) {
            // Handle success wrapper format
            setMentors(response.data.data);
          } else if (response.data && Array.isArray(response.data.mentors)) {
            // Handle mentors array in response.mentors
            setMentors(response.data.mentors);
          } else {
            throw new Error('Unexpected response format from server');
          }
        } else {
          throw new Error(`Unexpected status code: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching mentors:', error);
        setError('Failed to load mentors. Using mock data.');
        setMentors(mockMentors);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentors();
  }, []);

  // Load initial messages from WebSocket when a mentor is selected
  useEffect(() => {
    if (!selectedMentor) return;
    
    // Clear existing messages when switching mentors
    setMessages([]);
    
    // The actual messages will be received via WebSocket 'receiveMessage' event
    // which is already set up in the main WebSocket connection effect
  }, [selectedMentor?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputMessage.trim() || !selectedMentor || !user) return;

    const messageToSend = inputMessage.trim();
    const tempId = Date.now().toString();

    const newMessage: MessageType = {
      id: tempId,
      sender: 'student',
      text: messageToSend,
      time: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    try {
      if (socketRef.current?.connected) {
        socketRef.current.emit('sendMessage', {
          senderId: user.id,
          recipientId: selectedMentor.id,
          message: messageToSend,
          timestamp: newMessage.time
        });
      }

      // Message is already sent via WebSocket, no need for additional API call
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');

      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    }
  };

  const handleSelectMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    // Messages will be received via WebSocket 'receiveMessage' event
    setMessages([]);
    
    // If you want to request message history from the server, you can emit an event here
    // For example:
    if (socketRef.current?.connected) {
      socketRef.current.emit('requestMessageHistory', {
        userId: user?.id,
        mentorId: mentor.id
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);

    if (socketRef.current?.connected && selectedMentor) {
      socketRef.current.emit('typing', {
        senderId: user.id,
        recipientId: selectedMentor.id,
        isTyping: e.target.value.length > 0
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar with mentors list */}
      <div className="w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Mentors</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedMentor?.id === mentor.id ? 'bg-blue-50' : ''
              }`}
              onClick={() => handleSelectMentor(mentor)}
            >
              <div className="flex items-center">
                <img
                  src={mentor.avatar || '/default-avatar.png'}
                  alt={mentor.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{mentor.name}</p>
                  <p className="text-sm text-gray-500">{mentor.class}</p>
                  {mentor.lastMessage && (
                    <p className="text-xs text-gray-400 truncate">
                      {mentor.lastMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {selectedMentor ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center">
              <img
                src={selectedMentor.avatar || '/default-avatar.png'}
                alt={selectedMentor.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-medium">{selectedMentor.name}</p>
                <p className="text-sm text-gray-500">
                  {isConnected ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === 'student' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'student'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSend} className="flex items-center">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Select a mentor to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWithMentor;
