import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, X, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  data?: any;
}

export const Chatbot: React.FC<ChatbotProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Cafe Bluez assistant. I can help you with sales data, inventory info, and general cafe management questions. How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Sales related queries
    if (message.includes('sales') || message.includes('revenue') || message.includes('income')) {
      const todaySales = data?.salesLog?.reduce((sum: number, sale: any) => sum + (sale.price * sale.quantity), 0) || 0;
      return `Today's total sales are ₹${todaySales.toFixed(2)}. You've had ${data?.salesLog?.length || 0} transactions so far.`;
    }
    
    // Inventory queries
    if (message.includes('inventory') || message.includes('stock') || message.includes('supplies')) {
      const lowStockItems = data?.inventory?.filter((item: any) => item.stockLeft <= item.reorderThreshold) || [];
      if (lowStockItems.length > 0) {
        return `⚠️ You have ${lowStockItems.length} items running low: ${lowStockItems.map((item: any) => item.itemName).join(', ')}. Consider restocking soon!`;
      }
      return 'Your inventory levels look good! All items are above reorder thresholds.';
    }
    
    // Staff queries
    if (message.includes('staff') || message.includes('employee') || message.includes('attendance')) {
      const staffPresent = data?.attendance?.length || 0;
      return `You currently have ${staffPresent} staff members on duty today.`;
    }
    
    // Popular items
    if (message.includes('popular') || message.includes('best selling') || message.includes('top')) {
      if (data?.salesLog?.length > 0) {
        const itemCounts = data.salesLog.reduce((acc: any, sale: any) => {
          acc[sale.itemName] = (acc[sale.itemName] || 0) + sale.quantity;
          return acc;
        }, {});
        const topItem = Object.entries(itemCounts).sort((a: any, b: any) => b[1] - a[1])[0];
        return `Your best-selling item today is ${topItem[0]} with ${topItem[1]} units sold!`;
      }
      return "I don't have enough sales data to determine popular items yet.";
    }
    
    // Payment methods
    if (message.includes('payment') || message.includes('upi') || message.includes('cash')) {
      const upiSales = data?.salesLog?.filter((sale: any) => sale.paymentType === 'UPI').length || 0;
      const cashSales = data?.salesLog?.filter((sale: any) => sale.paymentType === 'Cash').length || 0;
      return `Payment breakdown: ${upiSales} UPI transactions, ${cashSales} cash transactions.`;
    }
    
    // Feedback queries
    if (message.includes('feedback') || message.includes('rating') || message.includes('review')) {
      const avgRating = data?.feedback?.reduce((sum: number, fb: any) => sum + fb.rating, 0) / (data?.feedback?.length || 1) || 0;
      return `Your average customer rating is ${avgRating.toFixed(1)}/5 stars based on recent feedback.`;
    }
    
    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return 'Hello! I\'m here to help you manage Cafe Bluez. Ask me about sales, inventory, staff, or any other cafe operations!';
    }
    
    // Help
    if (message.includes('help') || message.includes('what can you do')) {
      return 'I can help you with:\n• Sales data and revenue information\n• Inventory levels and low stock alerts\n• Staff attendance and performance\n• Customer feedback and ratings\n• Popular items and trends\n\nJust ask me anything about your cafe!';
    }
    
    // Default response
    return 'I\'m not sure about that specific query, but I can help you with sales data, inventory management, staff information, and customer feedback. What would you like to know?';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="w-80 h-96 bg-background border shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <h3 className="font-semibold">Cafe Assistant</h3>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 h-64">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about your cafe..."
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="sm">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};