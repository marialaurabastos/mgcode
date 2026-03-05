export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  user?: { name: string; }
}