export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const todos: Todo[] = [
  {
    id: 1,
    text: "Learn Next.js",
    completed: false,
  },
  {
    id: 2,
    text: "Learn Server Actions",
    completed: true,
  },
  {
    id: 3,
    text: "Build Todo App",
    completed: false,
  },
  {
    id: 4,
    text: "Deploy Todo App",
    completed: false,
  },
];
