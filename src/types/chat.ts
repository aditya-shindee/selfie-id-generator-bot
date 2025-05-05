
export interface UserInfo {
  name: string;
  email: string;
  age: string;
  photo: string | null;
}

export interface Message {
  id: string;
  content: string;
  sender: "bot" | "user";
  type?: "text" | "photo-request" | "photo";
}

export enum ChatStage {
  NAME = "name",
  EMAIL = "email",
  AGE = "age",
  PHOTO = "photo",
  COMPLETE = "complete"
}
