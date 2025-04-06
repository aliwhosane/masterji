export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Document {
  id: string;
  title: string;
  originalFilename: string;
  fileType: string;
  status: 'processing' | 'ready' | 'error';
  summary?: string;
  generatedQuestions?: Array<{
    question: string;
    answer: string;
  }>;
  generatedQuiz?: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Note {
  id: string;
  documentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}