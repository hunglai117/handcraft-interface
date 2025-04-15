import React from 'react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ input, isLoading, onChange, onSubmit, onCancel }) => {
  return (
    <form onSubmit={onSubmit} className="flex items-center">
      <div className="flex-grow relative">
        <input
          type="text"
          value={input}
          onChange={onChange}
          placeholder="Send a message..."
          className="w-full px-4 py-3 bg-white text-textDark border border-subtle rounded-lg focus:outline-none focus:ring-2 focus:ring-primary font-body"
          disabled={isLoading}
        />
        {isLoading ? (
          <button
            type="button"
            onClick={onCancel}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-md text-primary hover:bg-subtle/30 transition-colors"
            title="Cancel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-md ${
              !input.trim() ? 'text-subtle cursor-not-allowed' : 'text-primary hover:bg-subtle/30'
            }`}
            disabled={!input.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        )}
      </div>
    </form>
  );
};

export default ChatInput;
