export interface Category {
  id: string;
  name: string;
  taskIds: string[];
  order: number;
  color: string;
  createdAt?: string;
}

export interface Board {
  _id: string;
  name: string;
  owner: string;
  members: string[];
  taskCounter: number;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface BoardData {
  board: Board;
  tasksByCategory: Record<string, any[]>;
}
