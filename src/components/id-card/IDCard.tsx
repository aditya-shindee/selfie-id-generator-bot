
import React, { useRef } from "react";
import { UserInfo } from "@/types/chat";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, IdCard } from "lucide-react";
import html2canvas from "html2canvas";

interface IDCardProps {
  userInfo: UserInfo;
}

const IDCard: React.FC<IDCardProps> = ({ userInfo }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    
    try {
      const canvas = await html2canvas(cardRef.current);
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `${userInfo.name.replace(/\s+/g, "-").toLowerCase()}-id-card.png`;
      link.click();
    } catch (error) {
      console.error("Error generating ID card image:", error);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      <div 
        ref={cardRef} 
        className="w-full overflow-hidden rounded-xl shadow-lg border border-gray-200"
      >
        <div className="bg-chatbot-primary text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IdCard className="h-5 w-5" />
            <h3 className="font-semibold">ID CARD</h3>
          </div>
          <div className="text-xs">
            {new Date().toLocaleDateString()}
          </div>
        </div>
        
        <div className="id-card-gradient p-6">
          <div className="flex flex-col items-center mb-6">
            {userInfo.photo ? (
              <img 
                src={userInfo.photo} 
                alt="User" 
                className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-md mb-4" 
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-md mb-4">
                <span className="text-gray-500">No Photo</span>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 uppercase">Name</p>
              <p className="font-semibold text-lg">{userInfo.name}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 uppercase">Email</p>
              <p className="text-base">{userInfo.email}</p>
            </div>
            
            <div>
              <p className="text-xs text-gray-500 uppercase">Age</p>
              <p className="text-base">{userInfo.age} years</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 text-center text-xs text-gray-500">
          ID #: {Math.random().toString(36).substring(2, 10).toUpperCase()}
        </div>
      </div>
      
      <Button 
        onClick={handleDownload} 
        className="flex items-center gap-2 chat-gradient text-white px-6"
      >
        <Download className="h-4 w-4" />
        <span>Download ID Card</span>
      </Button>
    </div>
  );
};

export default IDCard;
