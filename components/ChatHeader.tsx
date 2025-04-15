import React from 'react';

const ChatHeader: React.FC = () => {
  return (
    <div className="bg-subtle py-6">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-h1 text-center mb-2 text-primary">Handcraft Assistant</h1>
        <p className="text-center max-w-xl mx-auto font-body text-textDark">
          Ask our virtual assistant about our handcrafted products, materials, or policies.
        </p>
      </div>
    </div>
  );
};

export default ChatHeader;
