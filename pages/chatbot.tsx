import { useState } from 'react';
import Layout from '../components/Layout';
import ChatHeader from '../components/ChatHeader';
import ChatMessagesContainer from '../components/ChatMessagesContainer';
import ChatFooter from '../components/ChatFooter';
import { Message, EChatRole } from '../types/chat';
import { v4 as uuidv4 } from 'uuid';

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sample suggested questions
  const suggestedQuestions = [
    'What products do you offer?',
    'What materials do you use?',
    'How long does shipping take?',
    'What is your return policy?',
  ];

  // Sample pre-defined responses for demonstration purposes
  const responses = {
    products:
      'We offer a variety of handcrafted products including pottery, textiles, wooden items, and jewelry. Each piece is unique and made with care by our artisans.',
    materials:
      'Our artisans work with sustainable materials including locally sourced wood, organic cotton, recycled metals, and natural clay.',
    shipping:
      'We ship worldwide! Domestic orders typically take 3-5 business days, while international shipping can take 7-14 business days.',
    returns: 'We have a 30-day return policy for most items. Custom orders are non-returnable.',
    default:
      "I'm sorry, I don't have specific information about that. Would you like to know about our products, materials, shipping policies, or return policies?",
  };

  // Function to generate a simple response based on user input
  const generateResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();

    if (
      lowerCaseMessage.includes('product') ||
      lowerCaseMessage.includes('sell') ||
      lowerCaseMessage.includes('offer')
    ) {
      return responses.products;
    } else if (
      lowerCaseMessage.includes('material') ||
      lowerCaseMessage.includes('made of') ||
      lowerCaseMessage.includes('made from')
    ) {
      return responses.materials;
    } else if (lowerCaseMessage.includes('ship') || lowerCaseMessage.includes('delivery')) {
      return responses.shipping;
    } else if (lowerCaseMessage.includes('return') || lowerCaseMessage.includes('refund')) {
      return responses.returns;
    } else {
      return responses.default;
    }
  };

  // Helper function to process user message and get assistant response
  const processUserMessage = (messageContent: string) => {
    // Create user message
    const userMessage: Message = {
      id: `${EChatRole.USER}-${uuidv4()}`,
      content: messageContent,
      role: EChatRole.USER,
      timestamp: Date.now(),
    };

    // Add to messages
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Generate assistant response
      const assistantResponse: Message = {
        id: `${EChatRole.ASSISTANT}-${uuidv4()}`,
        content: generateResponse(messageContent),
        role: EChatRole.ASSISTANT,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantResponse]);
      setIsLoading(false);
    }, 1000);
  };

  // Handle sending a message from input field
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (input.trim() === '') return;

    // Process the message
    processUserMessage(input);

    // Clear input field
    setInput('');
  };

  // Handle canceling a message request
  const handleCancelRequest = () => {
    setIsLoading(false);
  };

  // Handle selecting a suggested question
  const handleSuggestedQuestion = (question: string) => {
    processUserMessage(question);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <Layout title="Handcraft Assistant">
      <div className="fixed inset-0 flex flex-col h-screen bg-background">
        {/* Header */}
        <ChatHeader />

        {/* Chat Area - flexible height that fills available space */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Container */}
          <ChatMessagesContainer messages={messages} isLoading={isLoading} />

          {/* Footer with Input Area */}
          <ChatFooter
            messages={messages}
            input={input}
            isLoading={isLoading}
            suggestedQuestions={suggestedQuestions}
            onInputChange={handleInputChange}
            onSubmit={handleSendMessage}
            onCancel={handleCancelRequest}
            onSelectQuestion={handleSuggestedQuestion}
          />
        </div>
      </div>
    </Layout>
  );
}
