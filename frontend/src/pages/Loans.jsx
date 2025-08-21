import React, { useEffect, useMemo, useState } from 'react'
import { getLoans, updateLoanStatus } from '../api.js'
import LoanForm from '../components/LoanForm.jsx'

export default function Loans() {
  const [status, setStatus] = useState('')
  const [loans, setLoans] = useState([])
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const reload = async () => {
    setError(null)
    setBusy(true)
    try {
      const data = await getLoans(status || undefined)
      setLoans(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => { reload() }, [status])

  const onApprove = async (id) => {
    try {
      await updateLoanStatus(id, 'Approved')
      reload()
    } catch (err) {
      alert(err.message)
    }
  }
  const onReject = async (id) => {
    try {
      await updateLoanStatus(id, 'Rejected')
      reload()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div style={{display:'grid', gap:16}}>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <h2 style={{marginRight:'auto'}}>Loans</h2>
        <label>Status Filter:{' '}
          <select value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">All</option>
            <option>Pending</option>
            <option>Approved</option>
            <option>Rejected</option>
          </select>
        </label>
        <button onClick={reload} disabled={busy}>{busy ? 'Refreshing…' : 'Refresh'}</button>
      </div>

      <LoanForm onCreated={reload} />

      {error && <div style={{color:'crimson'}}>{error}</div>}

      <table width="100%" cellPadding="8" style={{borderCollapse:'collapse'}}>
        <thead>
          <tr style={{background:'#f5f5f5'}}>
            <th align="left">#</th>
            <th align="left">Application #</th>
            <th align="left">Applicant</th>
            <th align="right">Amount</th>
            <th align="center">Status</th>
            <th align="center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loans.map(l => (
            <tr key={l.id} style={{borderTop:'1px solid #eee'}}>
              <td>{l.id}</td>
              <td>{l.application_number}</td>
              <td>{l.applicant_name}</td>
              <td align="right">{Number(l.loan_amount).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
              <td align="center">{l.status}</td>
              <td align="center">
                {l.status === 'Pending' ? (
                  <>
                    <button onClick={() => onApprove(l.id)}>Approve</button>{' '}
                    <button onClick={() => onReject(l.id)}>Reject</button>
                  </>
                ) : <em>N/A</em>}
              </td>
            </tr>
          ))}
          {loans.length === 0 && (
            <tr><td colSpan="6"><em>No loans found.</em></td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
