import { assign, setup } from "xstate";

interface TodoItem {
  id: string;
  title: string;
  completed: boolean;
}

type TodosFilter = "all" | "active" | "completed";

export const todosMachine = setup({
  types: {} as {
    context: {
      todos: TodoItem[];
      filter: TodosFilter;
    };
    events:
      | { type: "todo.add"; value: string }
      | { type: "todo.delete"; id: string }
      | { type: "filter.change"; filter: TodosFilter }
      | { type: "todo.mark"; id: string; mark: "active" | "completed" };
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBcD2FWwHRowQwAcCBiXVLPCCAbQAYBdRUAzAS2VdQDsmQAPRAEZaAdgA0IAJ6IATADY5WACy05MgKwBfTRLLYyhEmSwQwAGzDIwdRkhAtY7TjzsCEgwXJFYRADgCcqhoS0gjyiipqWjogejjoqIakCVgAtngATgDWNrwOTty8bh4iMlgAzOXq-uUi6iFC5f7K6uWCGtq6CfoJSQBmrGZWGVgAxgAWeFwwuXb5HIWuQvJYvjK+7fVSjc1KrZvaMVzocLx6eWwLLqBu1Q0ISlj++x0xcQZEF45XRYgKtC02sFtggvIogdFtEA */
  id: "todos",
  initial: "todoapp",

  context: {
    todos: [],
    filter: "all",
  },
  entry: [
    assign({
      todos: () => {
        const storedTodos = window.localStorage.getItem("TodosLS");
        return storedTodos ? JSON.parse(storedTodos) : [];
      },
    }),
  ],
  states: {
    todoapp: {
      on: {
        "todo.add": {
          guard: ({ event }) => event.value.trim().length > 0, // Ensure the value is not empty
          actions: assign({
            todos: ({ context, event }) => {
              const newTodo: TodoItem = {
                id: Math.random().toString(36).substring(7), // Generate a unique ID
                title: event.value,
                completed: false,
              };
              const updatedTodos = [newTodo, ...context.todos]; // Add new todo to the list
              window.localStorage.setItem(
                "TodosLS",
                JSON.stringify(updatedTodos)
              ); // Update localStorage
              return updatedTodos; // Return the updated list of todos
            },
          }),
        },
        "todo.delete": {
          actions: assign({
            todos: ({ context, event }) => {
              const updatedTodos = context.todos.filter(
                (todo) => todo.id !== event.id
              ); // Filter out the deleted todo
              window.localStorage.setItem(
                "TodosLS",
                JSON.stringify(updatedTodos)
              ); // Update localStorage
              return updatedTodos; // Return the updated list of todos
            },
          }),
        },
        "todo.mark": {
          actions: assign({
            todos: ({ context, event }) => {
              const updatedTodos = context.todos.map((todo) =>
                todo.id === event.id
                  ? { ...todo, completed: event.mark === "completed" } // Update completed status
                  : todo
              );
              window.localStorage.setItem(
                "TodosLS",
                JSON.stringify(updatedTodos)
              ); // Update localStorage
              return updatedTodos; // Return the updated list of todos
            },
          }),
        },
        "filter.change": {
          actions: assign({
            filter: ({ event }) => event.filter, // Update filter state
          }),
        },
      },
    },
  },
});
