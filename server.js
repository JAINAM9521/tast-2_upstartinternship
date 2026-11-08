
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

let tasks = [
  { id: 1, title: "Learn REST API", completed: false },
  { id: 2, title: "Practice Postman", completed: true }
];

let nextId = 3;

// GET - All tasks
app.get("/api/tasks", (req, res) => {
  res.status(200).json({
    success: true,
    data: tasks
  });
});

// GET - Single task
app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  res.status(200).json({ success: true, data: task });
});

// POST - Create task
app.post("/api/tasks", (req, res) => {
  const { title, completed = false } = req.body;

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      success: false,
      message: "Valid title is required"
    });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "completed must be a boolean"
    });
  }

  const newTask = {
    id: nextId++,
    title: title.trim(),
    completed
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    data: newTask
  });
});

// PUT - Update task
app.put("/api/tasks/:id", (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const { title, completed } = req.body;

  if (typeof title !== "string" || !title.trim() ||
      typeof completed !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Valid title and completed fields are required"
    });
  }

  task.title = title.trim();
  task.completed = completed;

  res.status(200).json({
    success: true,
    data: task
  });
});

// DELETE - Delete task
app.delete("/api/tasks/:id", (req, res) => {
  const index = tasks.findIndex(
    t => t.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const deletedTask = tasks.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: deletedTask
  });
});

// Unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
