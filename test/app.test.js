const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { app, calculateTotal } = require("../src/app");

test("GET /tasks returns the task list", async () => {
  const response = await request(app).get("/tasks");

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.body));
});

test("calculates the total for several items", () => {
  const items = [
    { price: 10, quantity: 2 },
    { price: 5, quantity: 3 }
  ];

  assert.equal(calculateTotal(items), 35);
});

test("returns zero for an empty basket", () => {
  assert.equal(calculateTotal([]), 0);
});

test("does not mutate the input items", () => {
  const items = [{ price: 4, quantity: 2 }];
  const copy = JSON.parse(JSON.stringify(items));

  calculateTotal(items);

  assert.deepEqual(items, copy);
});

async function createTask(title) {
  const res = await request(app).post("/tasks").send({ title });
  return res.body;
}

test("PATCH /tasks/:id marks an existing task as completed", async () => {
  const task = await createTask("Write report");
  const res = await request(app)
    .patch(`/tasks/${task.id}`)
    .send({ completed: true });

  assert.equal(res.status, 200);
  assert.equal(res.body.id, task.id);
  assert.equal(res.body.completed, true);
  assert.equal(res.body.title, "Write report");
});

test("PATCH /tasks/:id can un-complete a task", async () => {
  const task = await createTask("Review PR");
  await request(app).patch(`/tasks/${task.id}`).send({ completed: true });

  const res = await request(app)
    .patch(`/tasks/${task.id}`)
    .send({ completed: false });

  assert.equal(res.status, 200);
  assert.equal(res.body.completed, false);
});

test("PATCH /tasks/:id returns 404 for an unknown task", async () => {
  const res = await request(app)
    .patch("/tasks/99999")
    .send({ completed: true });

  assert.equal(res.status, 404);
});

test("PATCH /tasks/:id returns 400 for a missing completed field", async () => {
  const task = await createTask("Missing field test");
  const res = await request(app).patch(`/tasks/${task.id}`).send({});

  assert.equal(res.status, 400);
});

test("PATCH /tasks/:id returns 400 for a non-boolean completed", async () => {
  const task = await createTask("Invalid type test");
  const res = await request(app)
    .patch(`/tasks/${task.id}`)
    .send({ completed: "yes" });

  assert.equal(res.status, 400);
});

test("PATCH /tasks/:id returns 400 for a non-numeric id", async () => {
  const res = await request(app)
    .patch("/tasks/abc")
    .send({ completed: true });

  assert.equal(res.status, 400);
});

test("DELETE /tasks/:id deletes an existing task", async () => {
  const task = await createTask("Delete me");
  const res = await request(app).delete(`/tasks/${task.id}`);

  assert.equal(res.status, 204);

  const getRes = await request(app).get("/tasks");
  assert.equal(getRes.status, 200);
  assert.equal(getRes.body.some((item) => item.id === task.id), false);
});

test("DELETE /tasks/:id returns 404 for an unknown task", async () => {
  const res = await request(app).delete("/tasks/99999");

  assert.equal(res.status, 404);
});

test("DELETE /tasks/:id returns 404 for a non-numeric id", async () => {
  const res = await request(app).delete("/tasks/abc");

  assert.equal(res.status, 404);
});


