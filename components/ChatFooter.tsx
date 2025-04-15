import React from 'react';
import { SuggestedQuestions } from './SuggestedQuestions';
import ChatInput from './ChatInput';
import { Message } from '@/types/chat';

interface ChatFooterProps {
  messages: Message[];
  input: string;
  isLoading: boolean;
  suggestedQuestions: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onSelectQuestion: (question: string) => void;
}

const ChatFooter: React.FC<ChatFooterProps> = ({
  messages,
  input,
  isLoading,
  suggestedQuestions,
  onInputChange,
  onSubmit,
  onCancel,
  onSelectQuestion,
}) => {
  return (
    <div className="border-t border-subtle bg-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 && (
          <SuggestedQuestions questions={suggestedQuestions} onSelectQuestion={onSelectQuestion} />
        )}

        <ChatInput
          input={input}
          isLoading={isLoading}
          onChange={onInputChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />

        <p className="text-xs text-accent mt-2 text-center font-body">Powered by HandcraftBK</p>
      </div>
    </div>
  );
};

export default ChatFooter;
