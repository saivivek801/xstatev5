import React, { useState } from "react";
import { useMachine } from "@xstate/react";
import { todosMachine } from "./todosMachine";

const Todos = () => {
  const [machine, send] = useMachine(todosMachine);
  const dropdownfilterValue = machine.context.filter;
  const todoList = machine.context.todos;

  const [inputElData, setInputElData] = useState("");

  const onChangeFetchDataFromInputEl = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputElData(event.target.value);
  };

  const onClickAddDataToTodosList = () => {
    send({ type: "todo.add", value: inputElData });
    setInputElData("");
  };

  const onClickMarkTodo = (id: string, completed: boolean) => {
    send({ type: "todo.mark", id, mark: completed ? "active" : "completed" });
  };

  const onClickDeleteTodo = (id: string) => {
    send({ type: "todo.delete", id });
  };

  const onchangeFilterDropdown = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value as "all" | "completed" | "active";
    send({ type: "filter.change", filter: value });
  };

  const filteredTodos = todoList.filter((todo) => {
    if (dropdownfilterValue === "active") return !todo.completed;
    if (dropdownfilterValue === "completed") return todo.completed;
    return true;
  });

  return (
    <>
      <input
        placeholder={"Add Todo"}
        value={inputElData}
        onChange={onChangeFetchDataFromInputEl}
      />
      <button
        type="button"
        onClick={onClickAddDataToTodosList}
        disabled={inputElData.trim() === ""}
      >
        Add
      </button>
      <div>
        <label htmlFor="filter">Filter:</label>
        <select
          id="filter"
          value={machine.context.filter}
          onChange={onchangeFilterDropdown}
        >
          <option value="all">all</option>
          <option value="active">active</option>
          <option value="completed">completed</option>
        </select>
      </div>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
              onClick={() => onClickMarkTodo(todo.id, todo.completed)}
            >
              {todo.title}
            </span>
            <button
              style={{ marginLeft: "24px" }}
              onClick={() => onClickDeleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Todos;
