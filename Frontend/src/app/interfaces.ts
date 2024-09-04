export interface Role {
  _id: string;
  name: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  roles: Role[];
}
