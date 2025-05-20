import React, { useState, useRef, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { Send, X, Bot, ChevronDown, ChevronUp, GripVertical } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  onCreatePage: (title: string, content: string) => Promise<void>;
  onUpdateContent: (content: string) => Promise<void>;
  onAddImage: (url: string) => Promise<void>;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onCreatePage, onUpdateContent, onAddImage }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);
    setError(null);

    try {
      // Process the command
      const command = input.toLowerCase();
      
      if (command.includes('create') && command.includes('page')) {
        const titleMatch = command.match(/called ['"]([^'"]+)['"]/);
        if (titleMatch) {
          const title = titleMatch[1];
          await onCreatePage(title, '');
          addAssistantMessage(`Created new page: ${title}`);
        } else {
          addAssistantMessage('Please specify a page title in quotes (e.g., create page called "About Us")');
        }
      }
      else if (command.includes('add') && command.includes('text')) {
        const contentMatch = command.match(/["']([^'"]+)["']/);
        if (contentMatch) {
          await onUpdateContent(contentMatch[1]);
          addAssistantMessage('Added text content to the page');
        } else {
          addAssistantMessage('Please specify the text content in quotes');
        }
      }
      else if (command.includes('add') && command.includes('image')) {
        const urlMatch = command.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          await onAddImage(urlMatch[0]);
          addAssistantMessage('Added image to the page');
        } else {
          addAssistantMessage('Please provide a valid image URL');
        }
      }
      else {
        addAssistantMessage("I'm not sure how to help with that. Try commands like:\n- Create page called \"About Us\"\n- Add text \"Hello World\"\n- Add image https://example.com/image.jpg");
      }
    } catch (err) {
      console.error('Error processing command:', err);
      setError(err instanceof Error ? err.message : 'Failed to process command');
    } finally {
      setIsProcessing(false);
    }
  };

  const addAssistantMessage = (content: string) => {
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMessage]);
  };

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(_, info) => {
        setPosition({
          x: position.x + info.offset.x,
          y: position.y + info.offset.y,
        });
      }}
      style={{
        x: position.x,
        y: position.y,
      }}
      className="fixed bottom-4 right-4 w-80 bg-black/90 border border-blue-400/30 rounded-lg shadow-lg"
    >
      <div
        className="flex items-center justify-between p-3 border-b border-blue-400/30 cursor-move"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <div className="flex items-center space-x-2 text-blue-400">
          <GripVertical className="w-4 h-4" />
          <Bot className="w-5 h-5" />
          <span>AI Assistant</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-blue-400 transition-colors"
            aria-label={isExpanded ? 'Minimize' : 'Expand'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setMessages([])}
            className="text-gray-400 hover:text-blue-400 transition-colors"
            aria-label="Clear chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          <div className="h-64 overflow-y-auto p-3 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-2 ${
                    message.role === 'assistant'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-50">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {error && (
            <div className="px-3 py-2 text-sm text-red-400 bg-red-500/10 border-t border-red-500/30">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-3 border-t border-blue-400/30">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isProcessing ? 'Processing...' : 'Type a command...'}
                disabled={isProcessing}
                className="flex-1 bg-black/50 border border-blue-400/30 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isProcessing || !input.trim()}
                className="text-blue-400 hover:text-blue-300 disabled:opacity-50 transition-colors"
                aria-label="Send command"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default AIAssistant;