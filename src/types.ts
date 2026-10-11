export interface User {
  name: string;
  role: 'student' | 'manager';
  domain: string;
  experience: string;
}

export interface Hackathon {
  id: number;
  title: string;
  desc: string;
  date: string;
  prize: string;
  domain: string;
  registered: number;
}

export interface CommunityPost {
  id: number;
  author: string;
  role: string;
  domain: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  likedByMe?: boolean;
}

export interface PeerStudent {
  name: string;
  domain: string;
  exp: 'Beginner' | 'Intermediate' | 'Expert';
  hackathons: number;
  avatar: string;
}

export interface ProfessorRequest {
  id: number;
  student: string;
  topic: string;
  details: string;
  status: 'Pending' | 'Assigned';
  professor: string | null;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  error?: string;
  feedback?: 'liked' | 'disliked' | null;
  groundingChunks?: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>;
  webSearchQueries?: string[];
  image?: {
    data: string;
    mimeType: string;
    name?: string;
  };
}

// Standalone chatbot types for reusable components
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  image?: {
    data: string;
    mimeType: string;
    name?: string;
  };
  groundingChunks?: Array<{
    web?: {
      uri: string;
      title: string;
    };
  }>;
  webSearchQueries?: string[];
  isStreaming?: boolean;
  error?: string;
  feedback?: 'liked' | 'disliked' | null;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  personaId?: string;
}

export interface Persona {
  id: string;
  name: string;
  icon: string;
  description: string;
  instruction: string;
}

export interface AppSettings {
  temperature: number;
  enableGoogleSearch: boolean;
  selectedPersonaId: string;
  customSystemInstruction: string;
}
