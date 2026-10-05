const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const tasks = [
  { id: 1, title: "Initial task", completed: false }
];

function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

app.get("/", (_req, res) => {
  res.json({
    service: "devops-platform-challenge",
    status: "ok"
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "healthy" });
});

app.get("/total", (_req, res) => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ];

  res.json({ total: calculateTotal(items) });
});

app.patch("/tasks/:id", (req, res) => {
  const taskId = Number(req.params.id);
  const { completed } = req.body || {};

  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "Invalid input: completed must be a boolean" });
  }

  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  task.completed = completed;
  return res.status(200).json(task);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log("Application listening on port " + port);
  });
}

module.exports = { app, calculateTotal, tasks };
