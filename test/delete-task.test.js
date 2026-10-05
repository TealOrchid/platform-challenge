const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const { app, tasks } = require("../src/app");

function sendDeleteRequest(server, path) {
  return new Promise((resolve, reject) => {
    const address = server.address();
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port: address.port,
        path,
        method: "DELETE"
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
    req.end();
  });
}

test("DELETE /tasks/:id deletes an existing task and returns 204", async () => {
  tasks.push({ id: 99, title: "Task to delete", completed: false });

  const server = app.listen(0);
  try {
    const res = await sendDeleteRequest(server, "/tasks/99");
    assert.equal(res.status, 204);
    assert.equal(tasks.find((t) => t.id === 99), undefined);
  } finally {
    server.close();
  }
});

test("DELETE /tasks/:id returns 404 for unknown task", async () => {
  const server = app.listen(0);
  try {
    const res = await sendDeleteRequest(server, "/tasks/9999");
    assert.equal(res.status, 404);
  } finally {
    server.close();
  }
});