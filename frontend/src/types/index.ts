// src/types.ts
export interface IQuery {
  id: string; // UUID
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: 'OPEN' | 'RESOLVED';
  formDataId: string;
}

export interface IFormData {
  id: string; // UUID
  question: string;
  answer: string;
  query: IQuery | null; // Single query associated with the form data (nullable)
}

export interface ICountedFormData {
  total: number;
  formData: IFormData[];
}
