export interface IQuery {
  id: string; // UUID
  title: string;
  description: string | null; // Query description (optional)
  createdAt: Date; // Timestamp of creation
  updatedAt: Date; // Timestamp of last update
  status: 'OPEN' | 'RESOLVED'; // Query status
  formDataId: string; // Foreign key referencing FormData.id
}

export interface IFormData {
  id: string; // UUID
  question: string; // Form data question
  answer: string; // Form data answer
  query: IQuery | null; // Single query associated with the form data (can be null if no query exists)
}

export interface ICountedFormData {
  total: number; // Total number of form data entries
  formData: IFormData[]; // List of form data entries with associated queries
}
