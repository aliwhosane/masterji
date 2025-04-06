import React, { useState, useRef, useEffect } from 'react';
import LoadingSpinner from './common/LoadingSpinner';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  documentId: string;
  onSendMessage: (message: string, documentId: string) => Promise<string>;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ documentId, onSendMessage }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I\'m your document assistant. Ask me anything about this document.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage: Message = {
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date()
    };
    
    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setError(null);
    setIsLoading(true);
    
    try {
      // Call API to get AI response
      const aiResponse = await onSendMessage(userMessage.text, documentId);
      
      // Add AI response to chat
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiResponse,
          timestamp: new Date()
        }
      ]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to get a response. Please try again.');
      
      // Add error message to chat
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[400px] md:h-[600px] bg-gray-50 border border-gray-200 rounded-lg">
      {/* Chat messages area */}
      <div className="flex-1 p-3 md:p-4 overflow-y-auto">
        <div className="space-y-3 md:space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex text-black ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] md:max-w-[80%] p-2 md:p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-white border border-gray-200 rounded-bl-none'
                }`}
              >
                <div className="text-xs md:text-sm">{message.text}</div>
                <div 
                  className={`text-xs mt-1 text-right ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-bl-none">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex justify-center">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Chat input area */}
      <div className="border-t border-gray-200 p-2 md:p-3">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ask a question about this document..."
            className="flex-1 text-black border border-gray-300 rounded-md px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <LoadingSpinner size="small" />
                <span className="ml-1">Sending</span>
              </span>
            ) : (
              'Send'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatAssistant;