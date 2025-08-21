import React, { useState } from 'react'
import { addLoan } from '../api.js'

export default function LoanForm({ onCreated }) {
  const [application_number, setApplicationNumber] = useState('')
  const [applicant_name, setApplicantName] = useState('')
  const [loan_amount, setLoanAmount] = useState('')
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      const payload = {
        application_number: Number(application_number),
        applicant_name,
        loan_amount: Number(loan_amount)
      }
      await addLoan(payload)
      setApplicationNumber(''); setApplicantName(''); setLoanAmount('')
      onCreated?.()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{display:'grid', gap:8, padding:12, border:'1px solid #ddd', borderRadius:8}}>
      <h4 style={{margin:0}}>New Loan</h4>
      <label>Application #
        <input value={application_number} onChange={e=>setApplicationNumber(e.target.value)} required />
      </label>
      <label>Applicant Name
        <input value={applicant_name} onChange={e=>setApplicantName(e.target.value)} required />
      </label>
      <label>Loan Amount
        <input value={loan_amount} onChange={e=>setLoanAmount(e.target.value)} required type="number" step="0.01"/>
      </label>
      {error && <div style={{color:'crimson'}}>{error}</div>}
      <button disabled={busy} type="submit">{busy ? 'Creating…' : 'Add Loan'}</button>
    </form>
  )
}
