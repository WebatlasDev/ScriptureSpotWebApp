export interface Subscription {
  id: string;
  email: string;
  createdDate: Date;
  form: string;
  url: string;
  unsubscribedDate?: Date | null;
  resubscribedDate?: Date | null;
}
