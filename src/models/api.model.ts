export interface APIError {
  message: string;
  status: number;
  statusText: string;
  details: any;
  url: string;
  method: string;
  timestamp: string;
}

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: APIError;
}
