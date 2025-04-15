import React from 'react';
import { EChatRole } from '../types/chat';

interface ChatMessageProps {
  id: string;
  content: string;
  role: EChatRole;
  timestamp: number;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ content, role }) => {
  return (
    <div className={`flex ${role === EChatRole.USER ? 'justify-end' : 'justify-start'}`}>
      {role === EChatRole.ASSISTANT && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-3 mt-1 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M13 7h-2v2h2V7zm0 4h-2v6h2v-6zm-1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
          </svg>
        </div>
      )}

      <div
        className={`max-w-[90%] md:max-w-[70%] px-4 py-3 rounded-lg ${
          role === EChatRole.USER
            ? 'bg-primary text-white rounded-tr-none'
            : 'bg-secondary/30 border border-subtle text-textDark rounded-tl-none'
        }`}
      >
        <div className="whitespace-pre-wrap font-body">
          {content.split('\n').map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-4' : ''}>
              {line}
            </p>
          ))}
        </div>
      </div>

      {role === EChatRole.USER && (
        <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center ml-3 mt-1 flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
          </svg>
        </div>
      )}
    </div>
  );
};
