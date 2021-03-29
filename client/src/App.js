import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const App = () => {
  // ============
  // Local State
  // ============

  const [socket, setSocket] = useState(
    io({
      autoConnect: false,
    })
  );
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");

  // ==================
  // Connect to server
  // ==================

  useEffect(() => {
    setSocket(io("http://localhost:8000"));
  }, []);

  // ==================
  // Listeners
  // ==================

  socket.on("updateData", (tasks) => updateTasks(tasks));
  socket.on("removeTask", (index) => removeTask(index, false));
  socket.on("addTask", (task) => addTask(task));

  // ================
  // Utils functions
  // ================

  const submitForm = (event) => {
    event.preventDefault();
    socket.emit("addTask", taskName);
    addTask(taskName);
  };

  const removeTask = (index, emitEvent) => {
    const newState = tasks.filter((_, itemIndex) => itemIndex !== index);
    setTasks([...newState]);
    emitEvent && socket.emit("removeTask", index);
  };

  const addTask = (task) => {
    const newState = [...tasks, task];
    setTasks([...newState]);
    setTaskName("");
  };

  const updateTasks = (allTasks) => {
    setTasks(allTasks);
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task, index) => (
            <li className="task" key={index}>
              {task}{" "}
              <button
                className="btn btn--red"
                onClick={() => removeTask(index, true)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form
          id="add-task-form"
          onSubmit={(event) => {
            submitForm(event);
          }}
        >
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={taskName}
            onChange={(event) => {
              setTaskName(event.target.value);
            }}
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
