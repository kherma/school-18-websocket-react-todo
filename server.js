// ================
// Imports
// ================

const express = require("express");
const socket = require("socket.io");
const { tasks } = require("./db");

// ================
// Server Setup
// ================

const port = 8000;
const app = express();

const server = app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`);
});
const io = socket(server);

// ================
// Server Events
// ================

io.on("connection", (socket) => {
  // Emit tasks array to connected socket
  console.log("User with id:" + socket.id + " has connected");
  socket.emit("updateData", tasks);

  // Listener of new task
  socket.on("addTask", (task) => {
    tasks.push(task);
    // Emit new task to other users
    socket.broadcast.emit("addTask", task);
  });

  // Listener of remove task
  socket.on("removeTask", (id) => {
    const index = tasks.indexOf(tasks.find((task) => task.id === id));
    tasks.splice(index, 1);
    // Emit remove task to other users
    socket.broadcast.emit("removeTask", id);
  });
});

// ================
// Middleware
// ================

app.use((req, res) => {
  res.status(404).send({ message: "Not found..." });
});
