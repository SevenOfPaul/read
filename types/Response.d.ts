export interface Response<T> {
  statusCode: number;
  success: boolean;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  details?: string[];
  data:T
}
