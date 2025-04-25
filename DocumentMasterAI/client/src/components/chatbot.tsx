import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bot, User, Send, X, Maximize2, Minimize2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "wouter";

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello, Dr. I'm your Quantum AI Assistant. How can I help with cancer patient analysis today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);
    
    try {
      const chatHistory = messages.map(msg => ({
        text: msg.text,
        isUser: msg.isUser,
      }));
      
      const response = await apiRequest("POST", "/api/chat/message", {
        message: inputMessage,
        chatHistory,
      });
      
      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.text,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message to AI Assistant",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <Card className={`w-80 md:w-96 shadow-xl transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
          <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0 border-b">
            <div className="flex items-center">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary mr-2">
                <Bot size={16} />
              </span>
              <div>
                <CardTitle className="text-sm font-medium">Quantum Assistant</CardTitle>
                <CardDescription className="text-xs">AI-powered clinical support</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={toggleMinimize}>
                {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
              </Button>
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={toggleChat}>
                <X size={14} />
              </Button>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <>
              <CardContent className="p-4 h-[380px] overflow-y-auto scrollbar-thin">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? "justify-end" : "justify-start"} chat-message-animation`}
                    >
                      {!message.isUser && (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary mr-2 flex-shrink-0">
                          <Bot size={16} />
                        </span>
                      )}
                      <div
                        className={`py-2 px-3 rounded-lg max-w-[80%] ${
                          message.isUser
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      {message.isUser && (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted ml-2 flex-shrink-0">
                          <User size={16} />
                        </span>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              <CardFooter className="p-3 border-t">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask a question about this case..."
                    className="min-h-[38px] resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <Button type="submit" size="icon" disabled={isLoading}>
                    {isLoading ? (
                      <div className="spinner w-4 h-4 border-2" />
                    ) : (
                      <Send size={16} />
                    )}
                  </Button>
                </form>
              </CardFooter>
            </>
          )}
        </Card>
      ) : (
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full shadow-lg"
          size="icon"
        >
          <Bot size={24} />
        </Button>
      )}
    </div>
  );
}
