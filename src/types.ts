export type Subject = 'Biology' | 'Chemistry' | 'Physics' | 'General';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  subject?: Subject;
  timestamp: number;
}

export interface NEETGuruResponse {
  subject: string;
  chapter: string;
  topic: string;
  concept: string;
  explanation: string;
  keyTakeaway: string;
  quickTip: string;
  pyqYear?: string;
  isHighProbability?: boolean;
}
