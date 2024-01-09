const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const path = require("path");

const dbPath = path.join(__dirname, "todoData.db");

const app = express();

app.use(cors());
app.use(express.json());

let db = null;

const InitializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () =>
      console.log("server running at http://localhost:3001/")
    );
  } catch (error) {
    process.exit(1);
  }
};

InitializeDbAndServer();

app.get("/getTodos", async (request, response) => {
  const Query = `
      SELECT * FROM todos;
   `;
  try {
    const userData = await db.all(Query);
    response.status(200).send(userData);
  } catch (error) {
    console.error(error);
    response.status(500).send("Server Error");
  }
});

app.post("/postTodo", async (request, response) => {
  const { id, task } = request.body;
  const updateQuery = `INSERT INTO todos (id,task)
    VALUES (
      '${id}',
      '${task}'
      );`;
  const data = await db.run(updateQuery);
  response.status(200).send({ message: "Added Success" });
});

app.delete("/deleteTodo", async (request, response) => {
  const { id } = request.body;
  const DeleteQuery = `
     DELETE FROM todos
     WHERE
    id = '${id}';
  `;
  await db.run(DeleteQuery);
  response.status(200).send({ message: "User deleted Successfully" });
});
