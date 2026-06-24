import { todos } from "@/lib/todos";

import { toggleTodo, deleteTodo, clearCompleted } from "@/app/todos/action";

export default function TodosPage() {
  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Todo List</h1>

      <div className="space-y-4">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div>
              <p
                className={`text-lg ${
                  todo.completed ? "text-gray-500 line-through" : ""
                }`}
              >
                {todo.text}
              </p>
            </div>

            <div className="flex gap-2">
              {/* Toggle Form */}
              <form action={toggleTodo.bind(null, todo.id)}>
                <button className="rounded bg-blue-500 px-4 py-2 text-white">
                  {todo.completed ? "Undo" : "Complete"}
                </button>
              </form>

              {/* Delete Form */}
              <form action={deleteTodo.bind(null, todo.id)}>
                <button className="rounded bg-red-500 px-4 py-2 text-white">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      <form action={clearCompleted}>
        <button className="mt-8 rounded bg-black px-5 py-3 text-white">
          Clear Completed
        </button>
      </form>
    </div>
  );
}
