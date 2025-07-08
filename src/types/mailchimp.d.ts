export interface MailchimpSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  language?: string;
  interests?: Record<string, boolean>;
}
