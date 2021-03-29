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
  console.log(`Server is running on port: ${port}`);
});
const io = socket(server);

// ================
// Server Events
// ================

io.on("connect", (socket) => {
  // Emit tasks array to connected socket
  socket.emit("updateData", tasks);

  // Listener of new task
  socket.on("addTask", (task) => {
    tasks.push(task);

    // Emit new task to other users
    socket.broadcast.emit("addTask", task);
  });

  // Listener of remove task
  socket.on("removeTask", (index) => {
    tasks.splice(index, 1);

    // Emit remove task to other users
    socket.broadcast.emit("removeTask", index);
  });
});

// ================
// Middleware
// ================

app.use((req, res) => {
  res.status(404).send({ message: "Not found..." });
});
