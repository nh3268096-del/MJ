
export enum Sender {
  USER = 'user',
  MJ = 'mj'
}

export type QuestionType = "MCQ" | "CQ" | "Normal";

export interface QuestionContent {
  type: QuestionType;
  subject: string;
  question: string;
  options?: string[]; // For MCQ (ক, খ, গ, ঘ)
  answer?: string;    // Correct option for MCQ
  cqParts?: {         // For CQ
    ka: string;       // জ্ঞানমূলক
    kha: string;      // অনুধাবনমূলক
    ga: string;       // প্রয়োগমূলক
    gha: string;      // উচ্চতর চিন্তাদক্ষতা
  };
  explanation?: string; // For Normal or additional context
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
  structuredContent?: QuestionContent;
}

export interface MultiplicationTable {
  number: number;
  rows: { factor: number; result: number }[];
}
