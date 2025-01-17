export interface IQuery {
  id: string; // UUID
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  formDataId: string;
}

export interface IFormData {
  id: string; // UUID
  question: string;
  answer: string;
  queries: IQuery[];
}

export interface ICountedFormData {
  total: number
  formData: IFormData[]
}
