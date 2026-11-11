import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const db = new Database(path.join(__dirname, "northline.db"));
db.pragma("journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    email TEXT,
    items_json TEXT NOT NULL,
    total INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "northline-api" }));

app.post("/api/orders", (req, res) => {
  const { items, total } = req.body ?? {};
  if (!Array.isArray(items) || items.length === 0 || !Number.isFinite(total) || total < 0) {
    return res.status(400).json({ error: "A valid cart and total are required." });
  }
  const valid = items.every(item =>
    Number.isInteger(item.id) && typeof item.name === "string" &&
    Number.isFinite(item.price) && Number.isInteger(item.qty) && item.qty > 0 &&
    ["S", "M", "L", "XL", "XXL"].includes(item.size)
  );
  if (!valid) return res.status(400).json({ error: "Invalid order item." });

  const computedTotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  if (computedTotal !== total) return res.status(400).json({ error: "Order total mismatch." });

  const result = db.prepare("INSERT INTO orders (items_json, total) VALUES (?, ?)")
    .run(JSON.stringify(items), computedTotal);
  res.status(201).json({ orderId: `NL-${String(result.lastInsertRowid).padStart(5, "0")}`, status: "pending" });
});

const dist = path.resolve(__dirname, "../dist");
app.use(express.static(dist));
app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Northline server listening on http://localhost:${port}`));
