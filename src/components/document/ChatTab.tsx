import React from 'react';
import { useAppDispatch } from '../../store/hooks';
import { sendChatMessage } from '../../store/slices/chatSlice';
import ChatAssistant from '../ChatAssistant';

interface ChatTabProps {
  documentId: string;
}

const ChatTab: React.FC<ChatTabProps> = ({ documentId }) => {
  const dispatch = useAppDispatch();

  const handleSendMessage = async (message: string, docId: string): Promise<string> => {
    try {
      const resultAction = await dispatch(sendChatMessage({ message, documentId: docId })).unwrap();
      if (!resultAction) {
        throw new Error('No response received from the server');
      }
      return resultAction;
    } catch (error) {
      console.error('Failed to send message:', error);
      // Rethrow with a more user-friendly message
      throw new Error('Unable to get a response. Please check your connection and try again.');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Chat Assistant</h2>
      <p className="text-gray-600 mb-4">
        Ask questions about this document and get AI-powered answers.
      </p>
      <ChatAssistant 
        documentId={documentId} 
        onSendMessage={handleSendMessage} 
      />
    </div>
  );
};

export default ChatTab;