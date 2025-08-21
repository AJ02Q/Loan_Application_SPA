import { Router } from 'express';
import { all, get, run } from '../db.js';
import { authRequired, branchManagerOnly } from '../middleware/auth.js';

const router = Router();

// protect all /loans routes
router.use(authRequired, branchManagerOnly);

// GET /loans?status=Pending|Approved|Rejected
router.get('/', async (req, res) => {
  const { status } = req.query;
  let query = `SELECT * FROM loans`;
  const params = [];
  if (status) {
    if (!['Pending','Approved','Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status filter' });
    }
    query += ` WHERE status = ?`;
    params.push(status);
  }
  query += ` ORDER BY id DESC`;
  const rows = await all(query, params);
  res.json(rows);
});

// GET /loans/:id
router.get('/:id', async (req, res) => {
  const loan = await get(`SELECT * FROM loans WHERE id = ?`, [req.params.id]);
  if (!loan) return res.status(404).json({ error: 'Not found' });
  res.json(loan);
});

// POST /loans
router.post('/', async (req, res) => {
  const { application_number, applicant_name, loan_amount, status } = req.body || {};
  if (application_number == null || !applicant_name || loan_amount == null) {
    return res.status(400).json({ error: 'application_number, applicant_name, and loan_amount are required' });
  }
  if (status && !['Pending','Approved','Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const result = await run(
      `INSERT INTO loans (application_number, applicant_name, loan_amount, status) VALUES (?,?,?,?)`,
      [application_number, applicant_name, Number(loan_amount), status || 'Pending']
    );
    const created = await get(`SELECT * FROM loans WHERE id = ?`, [result.lastID]);
    res.status(201).json(created);
  } catch (e) {
    if (String(e).includes('UNIQUE')) {
      return res.status(409).json({ error: 'application_number must be unique' });
    }
    console.error(e);
    res.status(500).json({ error: 'Failed to create loan' });
  }
});

// PUT /loans/:id/status
router.put('/:id/status', async (req, res) => {
  const { status } = req.body || {};
  if (!['Approved','Rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be Approved or Rejected' });
  }
  const loan = await get(`SELECT * FROM loans WHERE id = ?`, [req.params.id]);
  if (!loan) return res.status(404).json({ error: 'Not found' });
  if (loan.status !== 'Pending') {
    return res.status(400).json({ error: 'Only Pending loans can be updated' });
  }
  await run(`UPDATE loans SET status = ? WHERE id = ?`, [status, req.params.id]);
  const updated = await get(`SELECT * FROM loans WHERE id = ?`, [req.params.id]);
  res.json(updated);
});

export default router;
