import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', 'data.sqlite');

// ensure DB directory exists
const dir = path.dirname(DB_FILE);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

sqlite3.verbose();
export const db = new sqlite3.Database(DB_FILE);

export const run = (sql, params=[]) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve(this);
  });
});

export const get = (sql, params=[]) => new Promise((resolve, reject) => {
  db.get(sql, params, function(err, row) {
    if (err) reject(err);
    else resolve(row);
  });
});

export const all = (sql, params=[]) => new Promise((resolve, reject) => {
  db.all(sql, params, function(err, rows) {
    if (err) reject(err);
    else resolve(rows);
  });
});

export async function initDbIfNeeded() {
  await run(`PRAGMA foreign_keys = ON;`);

  await run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('branch_manager'))
  );`);

  await run(`CREATE TABLE IF NOT EXISTS loans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    application_number INTEGER UNIQUE NOT NULL,
    applicant_name TEXT NOT NULL,
    loan_amount REAL NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending','Approved','Rejected'))
  );`);

  // Seed default user and some loans if empty
  const userCount = await get(`SELECT COUNT(*) AS c FROM users;`);
  if (userCount.c === 0) {
    const username = 'manager@branch.local';
    const password = 'Passw0rd!';
    const hash = await bcrypt.hash(password, 10);
    await run(`INSERT INTO users (username, password_hash, role) VALUES (?,?,?)`, [username, hash, 'branch_manager']);
    console.log('Seeded default user:', username, 'password:', password);
  }

  const loanCount = await get(`SELECT COUNT(*) AS c FROM loans;`);
  if (loanCount.c === 0) {
    const demo = [
      [1001, 'Alice Johnson', 25000.00, 'Pending'],
      [1002, 'Bob Smith', 120000.50, 'Approved'],
      [1003, 'Chris Lee', 54000.00, 'Rejected'],
      [1004, 'Dana White', 80000.00, 'Pending']
    ];
    for (const [num, name, amt, st] of demo) {
      await run(`INSERT INTO loans (application_number, applicant_name, loan_amount, status) VALUES (?,?,?,?)`, [num, name, amt, st]);
    }
    console.log('Seeded demo loans.');
  }
}
