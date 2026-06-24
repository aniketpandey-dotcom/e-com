"use server";

import { revalidatePath } from "next/cache";
import { todos } from "@/lib/todos";

export async function toggleTodo(id: number) {
  const todo = todos.find((t) => t.id === id);

  if (todo) {
    todo.completed = !todo.completed;
  }

  revalidatePath("/todos");
}

export async function deleteTodo(id: number) {
  const index = todos.findIndex((t) => t.id === id);

  if (index !== -1) {
    todos.splice(index, 1);
  }

  revalidatePath("/todos");
}

export async function clearCompleted() {
  for (let i = todos.length - 1; i >= 0; i--) {
    if (todos[i].completed) {
      todos.splice(i, 1);
    }
  }

  revalidatePath("/todos");
}
