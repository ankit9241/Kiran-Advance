import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  class?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

type MessageType = { sender: 'mentor' | 'student'; text: string; time: string };

export default function MentorChatWithStudents({ user }: { user: any }) {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      class: '12th Grade',
      lastMessage: 'I need help with the React assignment',
      lastMessageTime: '2024-07-23T14:30:00'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@example.com',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      class: '11th Grade',
      lastMessage: 'Thanks for the explanation!',
      lastMessageTime: '2024-07-22T10:15:00'
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@example.com',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      class: '12th Grade',
      lastMessage: 'When is our next session?',
      lastMessageTime: '2024-07-21T16:45:00'
    },
  ]);

  const { studentId } = useParams();
  const [activeStudentId, setActiveStudentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, MessageType[]>>({});
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  // Initialize with mock data
  useEffect(() => {
    const initialMessages: Record<string, MessageType[]> = {
      '1': [
        { sender: 'student', text: 'Hello, I need help with the React assignment', time: '2024-07-23T14:30:00' },
        { sender: 'mentor', text: 'Hi Alice! Sure, what specific part do you need help with?', time: '2024-07-23T14:32:00' },
      ],
      '2': [
        { sender: 'student', text: 'I\'m having trouble with state management', time: '2024-07-22T10:10:00' },
        { sender: 'mentor', text: 'Let me explain how to use the Context API', time: '2024-07-22T10:12:00' },
        { sender: 'student', text: 'Thanks for the explanation!', time: '2024-07-22T10:15:00' },
      ],
      '3': [
        { sender: 'student', text: 'When is our next session?', time: '2024-07-21T16:45:00' },
      ],
    };
    setMessages(initialMessages);
    setIsInitialized(true);
  }, []);

  // Handle URL changes after initialization
  useEffect(() => {
    if (isInitialized && studentId) {
      setActiveStudentId(studentId);
    }
  }, [studentId, isInitialized]);

  // Responsive sidebar behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setSidebarOpen(true);
      else setSidebarOpen(false);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && activeStudentId) {
      const now = new Date().toISOString();
      const newMessage: MessageType = { sender: 'mentor', text: input, time: now };
      
      setMessages(prev => ({
        ...prev,
        [activeStudentId]: [...(prev[activeStudentId] || []), newMessage]
      }));
      
      // Update last message in students list
      setStudents(prev => 
        prev.map(student => 
          student.id === activeStudentId 
            ? { ...student, lastMessage: input, lastMessageTime: now }
            : student
        )
      );
      
      setInput('');
    }
  };

  const handleSelectStudent = (studentId: string) => {
    setActiveStudentId(studentId);
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const activeStudent = activeStudentId ? students.find(s => s.id === activeStudentId) : null;
  const activeMessages = activeStudentId ? messages[activeStudentId] || [] : [];
  let lastDate = '';

  return (
    <div className="flex flex-col md:flex-row w-full min-h-[80vh] bg-white rounded-lg shadow-lg mt-4 md:mt-8 overflow-hidden">
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden p-3 bg-blue-500 text-white flex items-center space-x-2 w-full justify-center font-medium"
        onClick={() => setSidebarOpen(true)}
        style={{ display: sidebarOpen ? 'none' : 'flex' }}
      >
        <i className="ri-user-line text-xl"></i>
        <span>Students</span>
      </button>

      {/* Sidebar: Student List */}
      <aside
        className={`bg-gray-50 border-r border-gray-200 flex flex-col w-full md:w-80 z-30 fixed md:static top-0 left-0 h-full md:h-auto transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} md:relative`}
        style={{ maxWidth: 320 }}
      >
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Students</h2>
            <button
              className="md:hidden text-2xl text-gray-500 hover:text-gray-800"
              onClick={() => setSidebarOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="mt-2 relative">
            <input
              type="text"
              placeholder="Search students..."
              className="w-full px-3 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <i className="ri-search-line absolute left-3 top-2.5 text-gray-400"></i>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {students.map(student => (
            <button
              key={student.id}
              onClick={() => handleSelectStudent(student.id)}
              className={`w-full flex items-center p-3 text-left transition-colors ${activeStudentId === student.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
            >
              <img 
                src={student.avatar} 
                alt={student.name} 
                className="w-12 h-12 rounded-full object-cover mr-3 border-2 border-blue-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-gray-900 truncate">{student.name}</h3>
                  {student.lastMessageTime && (
                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                      {formatTime(student.lastMessageTime)}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">{student.class}</p>
                {student.lastMessage && (
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {student.lastMessage}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Chat Window */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {activeStudentId ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-4 flex items-center bg-white">
              <div className="flex items-center">
                <button 
                  className="text-gray-600 mr-2"
                  onClick={() => {
                    setActiveStudentId(null);
                    setSidebarOpen(true);
                  }}
                >
                  <i className="ri-arrow-left-line text-xl"></i>
                </button>
                {window.innerWidth < 768 && (
                  <button 
                    className="text-gray-600 mr-2"
                    onClick={() => setSidebarOpen(true)}
                  >
                    <i className="ri-menu-line text-xl"></i>
                  </button>
                )}
              </div>
              <img 
                src={activeStudent?.avatar || '/assets/students.png'} 
                alt={activeStudent?.name || 'Student'} 
                className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-blue-100"
              />
              <div>
                <h2 className="font-semibold text-gray-900">{activeStudent?.name || 'Student'}</h2>
                <p className="text-xs text-gray-500">{activeStudent?.class || 'Student'}</p>
              </div>
              <div className="ml-auto flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                  <i className="ri-phone-line"></i>
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                  <i className="ri-video-add-line"></i>
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                  <i className="ri-more-2-fill"></i>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {activeMessages.length > 0 ? (
                activeMessages.map((msg, idx) => {
                  const msgDate = new Date(msg.time).toDateString();
                  let showDate = false;
                  if (msgDate !== lastDate) {
                    showDate = true;
                    lastDate = msgDate;
                  }
                  
                  return (
                    <React.Fragment key={idx}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <span className="bg-white text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm border border-gray-200">
                            {formatDate(msg.time)}
                          </span>
                        </div>
                      )}
                      <div 
                        className={`flex ${msg.sender === 'mentor' ? 'justify-end' : 'justify-start'} mb-3`}
                      >
                        <div 
                          className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl px-4 py-2 rounded-lg ${msg.sender === 'mentor' ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 border border-gray-200'}`}
                        >
                          <div className="text-sm md:text-base">{msg.text}</div>
                          <div 
                            className={`text-xs mt-1 text-right ${msg.sender === 'mentor' ? 'text-blue-100' : 'text-gray-500'}`}
                          >
                            {formatTime(msg.time)}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <i className="ri-chat-3-line text-4xl mb-2"></i>
                  <p>No messages yet</p>
                  <p className="text-sm mt-1">Start a conversation with {activeStudent?.name?.split(' ')[0] || 'this student'}</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <form 
              onSubmit={handleSend}
              className="border-t border-gray-200 p-3 bg-white"
            >
              <div className="flex items-center space-x-2">
                <button 
                  type="button" 
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                >
                  <i className="ri-attachment-2"></i>
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
                />
                <button 
                  type="submit"
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  <i className="ri-send-plane-fill"></i>
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-500">
            <div className="bg-blue-50 p-6 rounded-full mb-4">
              <i className="ri-chat-3-line text-4xl text-blue-500"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">Welcome to Messages</h3>
            <p className="max-w-md mb-6">Select a student from the sidebar to start a conversation</p>
            <button 
              className="md:hidden bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              View Students
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
