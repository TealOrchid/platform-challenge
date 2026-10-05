const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { app, tasks } = require("../src/app");

function sendPatchRequest(server, path, body) {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const payload = JSON.stringify(body);
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: address.port,
        path,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload)
        }
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          resolve({
            status: res.statusCode,
            body: data ? JSON.parse(data) : null
          });
        });
      }
    );
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

test("PATCH /tasks/:id marks an existing task as completed", async () => {
  tasks.length = 0;
  tasks.push({ id: 1, title: "Test task", completed: false });

  const server = app.listen(0);
  try {
    const res = await sendPatchRequest(server, "/tasks/1", { completed: true });
    assert.equal(res.status, 200);
    assert.equal(res.body.id, 1);
    assert.equal(res.body.completed, true);
  } finally {
    server.close();
  }
});

test("PATCH /tasks/:id returns 404 for unknown task", async () => {
  const server = app.listen(0);
  try {
    const res = await sendPatchRequest(server, "/tasks/999", { completed: true });
    assert.equal(res.status, 404);
  } finally {
    server.close();
  }
});

test("PATCH /tasks/:id returns 400 for invalid input", async () => {
  const server = app.listen(0);
  try {
    const res = await sendPatchRequest(server, "/tasks/1", { completed: "invalid" });
    assert.equal(res.status, 400);
  } finally {
    server.close();
  }
});
