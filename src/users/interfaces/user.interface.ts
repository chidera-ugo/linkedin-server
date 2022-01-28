export interface User {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  email: string;
  password: string;
  refresh_token?: string;
}
