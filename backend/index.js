// todo-docker-angular/backend/index.js
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.POSTGRES_HOST || "db",
  port: process.env.POSTGRES_PORT || 5432,
  user: process.env.POSTGRES_USER || "todo",
  password: process.env.POSTGRES_PASSWORD || "todo",
  database: process.env.POSTGRES_DB || "todo",
});

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}
init().catch((e) => {
  console.error("DB init error:", e);
  process.exit(1);
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/todos", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM todos ORDER BY id DESC");
  res.json(rows);
});

app.post("/api/todos", async (req, res) => {
  const title = (req.body.title || "").trim();
  if (!title) return res.status(400).json({ error: "title required" });
  const { rows } = await pool.query(
    "INSERT INTO todos(title) VALUES ($1) RETURNING *",
    [title]
  );
  res.status(201).json(rows[0]);
});

app.patch("/api/todos/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, completed } = req.body;
  const { rows } = await pool.query(
    "UPDATE todos SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 RETURNING *",
    [title, completed, id]
  );
  if (rows.length === 0) return res.sendStatus(404);
  res.json(rows[0]);
});

app.delete("/api/todos/:id", async (req, res) => {
  const id = Number(req.params.id);
  await pool.query("DELETE FROM todos WHERE id=$1", [id]);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`API listening on http://0.0.0.0:${port}`);
});
