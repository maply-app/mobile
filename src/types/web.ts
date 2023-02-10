import { ReceivedRequest, SentRequest } from './user'

export type NetworkRequestAnswer<T> =
  | {
  message: string;
  data: T;
}
  | {
  statusCode: number;
  message: string;
  error: string;
};

export interface ApiAnswer<T> {
  status: string;
  data: T;
}

export type RequestsApiAnswer<T extends SentRequest | ReceivedRequest> = ApiAnswer<T[]>
