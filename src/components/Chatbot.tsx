
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import ChatMessage from "./chat/ChatMessage";
import ChatInput from "./chat/ChatInput";
import PhotoUpload, { PhotoUploadRef } from "./chat/PhotoUpload";
import IDCard from "./id-card/IDCard";
import { Message, UserInfo, ChatStage } from "@/types/chat";
import { generateId, getNextQuestion, processUserResponse } from "@/utils/chatUtils";
import { openAIService } from "@/services/OpenAIService";

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    age: "",
    photo: null,
  });
  const [stage, setStage] = useState<ChatStage>(ChatStage.NAME);
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiConfigured, setApiConfigured] = useState(false);
  const [apiKey, setApiKey] = useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const photoUploadRef = useRef<PhotoUploadRef>(null);
  const { toast } = useToast();

  // Initialize chatbot with first message
  useEffect(() => {
    const firstMessage = getNextQuestion(ChatStage.NAME);
    setMessages([firstMessage]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Configure OpenAI when API key is set
  useEffect(() => {
    if (apiKey) {
      openAIService.configure({
        apiKey: apiKey,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
      });
      setApiConfigured(true);
    }
  }, [apiKey]);

  const handleSendMessage = async (content: string) => {
    if (isProcessing) return;
    setIsProcessing(true);

    // Add user message to chat
    const userMessage: Message = {
      id: generateId(),
      content,
      sender: "user",
    };
    setMessages((prev) => [...prev, userMessage]);

    // Process user response based on current stage
    const validation = processUserResponse(content, stage);
    
    if (!validation.isValid) {
      // Add error message
      const errorMessage: Message = {
        id: generateId(),
        content: validation.errorMessage || "Please provide a valid response.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsProcessing(false);
      return;
    }

    // Update user info based on current stage
    switch (stage) {
      case ChatStage.NAME:
        setUserInfo((prev) => ({ ...prev, name: content.trim() }));
        break;
      case ChatStage.EMAIL:
        setUserInfo((prev) => ({ ...prev, email: content.trim() }));
        break;
      case ChatStage.AGE:
        setUserInfo((prev) => ({ ...prev, age: content.trim() }));
        break;
      default:
        break;
    }

    // Determine next stage
    const nextStage = getNextStage(stage);
    setStage(nextStage);

    // Add short delay before bot response
    await new Promise((resolve) => setTimeout(resolve, 600));

    // If just collected name and API is configured, generate a personalized welcome
    if (stage === ChatStage.NAME && apiConfigured) {
      try {
        const welcomeMessage = await openAIService.generateWelcomeMessage(content.trim());
        const botMessage: Message = {
          id: generateId(),
          content: welcomeMessage,
          sender: "bot",
        };
        setMessages((prev) => [...prev, botMessage]);
        
        // Add short delay before next question
        await new Promise((resolve) => setTimeout(resolve, 800));
      } catch (error) {
        console.error("Error generating welcome message:", error);
      }
    }

    // Get next question based on next stage
    const nextQuestion = getNextQuestion(nextStage);
    setMessages((prev) => [...prev, nextQuestion]);
    setIsProcessing(false);
  };

  const getNextStage = (currentStage: ChatStage): ChatStage => {
    switch (currentStage) {
      case ChatStage.NAME:
        return ChatStage.EMAIL;
      case ChatStage.EMAIL:
        return ChatStage.AGE;
      case ChatStage.AGE:
        return ChatStage.PHOTO;
      case ChatStage.PHOTO:
        return ChatStage.COMPLETE;
      default:
        return ChatStage.NAME;
    }
  };

  const handlePhotoUpload = () => {
    // Trigger file input click using the ref
    if (photoUploadRef.current) {
      photoUploadRef.current.triggerFileInput();
    }
  };

  const handlePhotoSelected = async (photoUrl: string) => {
    // Update user info with photo
    setUserInfo((prev) => ({ ...prev, photo: photoUrl }));
    
    // Add photo message
    const photoMessage: Message = {
      id: generateId(),
      content: "Photo uploaded successfully!",
      sender: "user",
      type: "photo",
    };
    setMessages((prev) => [...prev, photoMessage]);

    // Short delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Move to complete stage
    setStage(ChatStage.COMPLETE);

    // Add completion message
    let completionMessage = "Thank you! Your ID card has been generated. You can download it below.";
    
    if (apiConfigured) {
      try {
        completionMessage = await openAIService.generateCompletionMessage(
          { ...userInfo, photo: photoUrl }
        );
      } catch (error) {
        console.error("Error generating completion message:", error);
      }
    }

    const botMessage: Message = {
      id: generateId(),
      content: completionMessage,
      sender: "bot",
    };
    setMessages((prev) => [...prev, botMessage]);

    toast({
      title: "ID Card Ready",
      description: "Your ID card has been generated successfully!",
    });
  };

  const handleSetApiKey = (key: string) => {
    if (!key.trim()) {
      toast({
        title: "Error",
        description: "API key cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setApiKey(key);
    toast({
      title: "API Key Set",
      description: "API key configured successfully",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="shadow-lg border-t-4 border-t-chatbot-primary">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <span className="chat-gradient text-white p-2 rounded-lg">ID</span> 
            <span>ID Card Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!apiConfigured && (
            <div className="bg-amber-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-amber-800 mb-2">Set API Key</h3>
              <p className="text-sm text-amber-700 mb-2">
                For a more personalized experience, please enter your Gemini API key.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  className="border rounded px-3 py-2 flex-1 text-sm"
                  placeholder="Enter your Gemini API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <Button 
                  onClick={() => handleSetApiKey(apiKey)}
                  variant="outline"
                  className="text-sm"
                >
                  Set Key
                </Button>
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-3 h-[400px] overflow-y-auto mb-3">
                {messages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onPhotoUpload={handlePhotoUpload}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              <PhotoUpload
                ref={photoUploadRef}
                onPhotoSelected={handlePhotoSelected}
              />
              
              <ChatInput
                onSendMessage={handleSendMessage}
                disabled={isProcessing || stage === ChatStage.PHOTO || stage === ChatStage.COMPLETE}
                placeholder={
                  stage === ChatStage.PHOTO
                    ? "Please upload a photo..."
                    : stage === ChatStage.COMPLETE
                    ? "Chat completed"
                    : "Type your response..."
                }
              />
            </div>

            {stage === ChatStage.COMPLETE && (
              <div className="flex-1 flex items-center justify-center">
                <IDCard userInfo={userInfo} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Chatbot;
