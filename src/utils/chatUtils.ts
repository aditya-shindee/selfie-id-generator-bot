
import { Message, ChatStage } from "@/types/chat";

// Generate a random ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Get the next question based on the current chat stage
export const getNextQuestion = (stage: ChatStage): Message => {
  switch (stage) {
    case ChatStage.NAME:
      return {
        id: generateId(),
        content: "Hi there! I'm your ID card assistant. What's your name?",
        sender: "bot",
      };
    case ChatStage.EMAIL:
      return {
        id: generateId(),
        content: "Great! What's your email address?",
        sender: "bot",
      };
    case ChatStage.AGE:
      return {
        id: generateId(),
        content: "How old are you?",
        sender: "bot",
      };
    case ChatStage.PHOTO:
      return {
        id: generateId(),
        content: "Almost done! Please upload a photo for your ID card.",
        sender: "bot",
        type: "photo-request",
      };
    case ChatStage.COMPLETE:
      return {
        id: generateId(),
        content: "Thank you! Your ID card has been generated. You can download it below.",
        sender: "bot",
      };
    default:
      return {
        id: generateId(),
        content: "Let's start over. What's your name?",
        sender: "bot",
      };
  }
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate age
export const isValidAge = (age: string): boolean => {
  const ageNum = parseInt(age);
  return !isNaN(ageNum) && ageNum > 0 && ageNum < 120;
};

// Process the user's response based on the current stage
export const processUserResponse = (response: string, stage: ChatStage): { isValid: boolean; errorMessage?: string } => {
  switch (stage) {
    case ChatStage.NAME:
      if (response.trim().length < 2) {
        return { isValid: false, errorMessage: "Please enter a valid name (at least 2 characters)." };
      }
      return { isValid: true };
    case ChatStage.EMAIL:
      if (!isValidEmail(response)) {
        return { isValid: false, errorMessage: "Please enter a valid email address." };
      }
      return { isValid: true };
    case ChatStage.AGE:
      if (!isValidAge(response)) {
        return { isValid: false, errorMessage: "Please enter a valid age between 1 and 119." };
      }
      return { isValid: true };
    default:
      return { isValid: true };
  }
};
