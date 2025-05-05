
import React from "react";
import { Message } from "@/types/chat";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: Message;
  onPhotoUpload: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onPhotoUpload }) => {
  const isBot = message.sender === "bot";
  const isPhotoRequest = message.type === "photo-request";

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-4`}>
      <div className={`message-bubble ${isBot ? "bot-message" : "user-message"}`}>
        <p className="text-sm">{message.content}</p>

        {isPhotoRequest && (
          <div className="mt-2">
            <Button 
              onClick={onPhotoUpload} 
              variant="secondary" 
              className="flex items-center gap-2 mt-2"
            >
              <Camera className="w-4 h-4" />
              <span>Upload Photo</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
