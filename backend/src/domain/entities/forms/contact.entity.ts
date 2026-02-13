export interface Contact {
  id: string;
  userId?: string | null;
  name: string;
  email: string;
  subject: string;
  reason: string;
  message: string;
  targetEmail: string;
  createdDate: Date;
  url: string;
}
