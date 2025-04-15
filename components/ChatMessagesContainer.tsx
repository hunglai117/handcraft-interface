import React, { useRef, useEffect } from 'react';
import { Message } from '../types/chat';
import { Greeting } from './Greeting';
import { ChatMessage } from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';

interface ChatMessagesContainerProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessagesContainer: React.FC<ChatMessagesContainerProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      className="flex-1 overflow-y-auto p-4 sm:p-6"
      style={{
        backgroundImage: 'radial-gradient(circle at center, #e6ccb3 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Greeting />
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map(message => (
              <ChatMessage
                key={message.id}
                id={message.id}
                content={message.content}
                role={message.role}
                timestamp={message.timestamp}
              />
            ))}
          </div>
        )}

        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessagesContainer;
