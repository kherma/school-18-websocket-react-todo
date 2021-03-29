// ================
// Imports
// ================

const express = require("express");

// ================
// Server Setup
// ================

const port = 8000;
const app = express();

const server = app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port: ${port}`);
});

// ================
// Middleware
// ================

app.use((req, res) => {
  res.status(404).send({ message: "Not found..." });
});
