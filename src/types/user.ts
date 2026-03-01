export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_no: string;
  roles: string[];
  is_active: boolean;
  permissions: string[];
}
export interface Role {
  id: number;
  name: string;
}