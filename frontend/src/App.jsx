import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [activePage, setActivePage] = useState('Dashboard')
  const [showForm, setShowForm] = useState(false)
  const [invoiceId, setInvoiceId] = useState('')
  const [vendor, setVendor] = useState('')
  const [amount, setAmount] = useState('')
  const [invoiceDate, setInvoiceDate] = useState('')
  const [invoices, setInvoices] = useState([])
  useEffect(() => {
  fetch('http://127.0.0.1:8000/api/invoices/')
    .then((response) => response.json())
    .then((data) => setInvoices(data))
    .catch((error) => console.log(error))
}, [])

const handleSaveInvoice = () => {

  if (invoiceId === '' || vendor === '' || amount === '' || invoiceDate === '') {
    alert('Please fill all fields')
    return
  }
const invoiceExists = invoices.some((invoice) => invoice.id === invoiceId)

if (invoiceExists) {
  alert('Invoice ID already exists')
  return
}

  const newInvoice = {
    id: invoiceId,
    vendor: vendor,
    amount: amount,
    date: invoiceDate
  }

  fetch('http://127.0.0.1:8000/api/invoices/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newInvoice)
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message)

      setInvoices([...invoices, {
        id: invoiceId,
        vendor: vendor,
        amount: amount,
        status: 'Pending',
        date: invoiceDate
      }])

      setInvoiceId('')
      setVendor('')
      setAmount('')
      setInvoiceDate('')
      setShowForm(false)
    })
    .catch((error) => console.log(error))
}

const handleDeleteInvoice = (id) => {

  fetch(`http://127.0.0.1:8000/api/invoices/${id}/`, {
    method: 'DELETE'
  })
    .then((response) => response.json())
    .then(() => {
      const updatedInvoices = invoices.filter((invoice) => invoice.id !== id)

      setInvoices(updatedInvoices)
    })
    .catch((error) => console.log(error))
}

 const filteredInvoices = invoices.filter((invoice) =>
  invoice.id.toLowerCase().includes(search.toLowerCase()) ||
  invoice.vendor.toLowerCase().includes(search.toLowerCase())
)
  return (
    <div className="app">

      <div className="sidebar">
        <h2>AP Automation</h2>

        <ul>
       <li onClick={() => setActivePage('Dashboard')}>Dashboard</li>
       <li onClick={() => setActivePage('Invoices')}>Invoices</li>
       <li onClick={() => setActivePage('Vendors')}>Vendors</li>
      <li onClick={() => setActivePage('Approvals')}>Approvals</li>
      <li onClick={() => setActivePage('Payments')}>Payments</li>
      <li onClick={() => setActivePage('Reports')}>Reports</li>
    </ul>
      </div>

      <div className="main-content">
      {activePage === 'Dashboard' && (
  <>

  <h1>Dashboard</h1>
  <p>Welcome to Accounts Payable Automation System</p>

  <div className="cards">

    <div className="card">
      <h3>Total Invoices</h3>
      <h2>{invoices.length}</h2>
    </div>

    <div className="card">
      <h3>Pending Approvals</h3>
      <h2>{invoices.filter((invoice) => invoice.status === 'Pending').length}</h2>
    </div>

    <div className="card">
      <h3>Paid Invoices</h3>
      <h2>{invoices.filter((invoice) => invoice.status === 'Paid').length}</h2>
    </div>

    <div className="card">
      <h3>Total Vendors</h3>
     <h2>{new Set(invoices.map((invoice) => invoice.vendor)).size}</h2>
    </div>
  </div>

  <div className="recent-invoices">

  <div className="invoice-heading">
    <h2>Recent Invoices</h2>

    <button
  className="add-button"
  onClick={() => setShowForm(true)}>
  + Add Invoice
   </button>
  </div>
    {showForm && (
  <div className="invoice-form">
    <h3>Add New Invoice</h3>

    <label>Invoice ID</label>
    <input type="text" placeholder="Enter invoice ID" value={invoiceId} 
    onChange={(event) => setInvoiceId(event.target.value)}/>

    <label>Vendor Name</label>
    <input type="text" placeholder="Enter vendor name"   value={vendor}
      onChange={(event) => setVendor(event.target.value)} />

    <label>Amount</label>
    <input type="number" placeholder="Enter amount"  value={amount}
    onChange={(event) => setAmount(event.target.value)} />

    <label>Invoice Date</label>
    <input type="date" value={invoiceDate}
    onChange={(event) => setInvoiceDate(event.target.value)}/>

  <button className="save-button" onClick={handleSaveInvoice}>Save invoice</button>
  <button className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button>
   </div>
   )}
    <input
    type="text"
    placeholder="Search invoices..."
    className="search-input"
    value={search}
    onChange={(event) => setSearch(event.target.value)}
    />

  <table>
  <thead>
    <tr>
      <th>Invoice ID</th>
      <th>Vendor</th>
      <th>Amount</th>
      <th>Status</th>
      <th>Action</th>
    </tr>
  </thead>

  <tbody>
  {filteredInvoices.map((invoice) => (
    <tr key={invoice.id}>
      <td>{invoice.id}</td>
      <td>{invoice.vendor}</td>
      <td>₹{Number(invoice.amount).toLocaleString('en-IN')}</td>
      <td>
  <span className={invoice.status.toLowerCase()}>
    {invoice.status}
  </span>
</td>

<td>
  <button className="delete-button" onClick={() => handleDeleteInvoice(invoice.id)}>Delete</button>
</td>
    </tr>
  ))}
</tbody>
  </table>

</div>

  </>
)}
 
{activePage === 'Vendors' && (
  <div>
    <h1>Vendor Management</h1>
    <p>Manage your suppliers and vendor information.</p>

    <h3>Total Vendors: {new Set(invoices.map((invoice) => invoice.vendor)).size}</h3>

    <table>
      <thead>
        <tr>
          <th>Vendor Name</th>
          <th>Total Invoices</th>
          <th>Total Amount</th>
        </tr>
      </thead>

      <tbody>
        {Array.from(new Set(invoices.map((invoice) => invoice.vendor))).map((vendor) => (
          <tr key={vendor}>
            <td>{vendor}</td>
            <td>{invoices.filter((invoice) => invoice.vendor === vendor).length}</td>
            <td>
              ₹{invoices
                .filter((invoice) => invoice.vendor === vendor)
                .reduce((total, invoice) => total + Number(invoice.amount), 0)
                .toLocaleString('en-IN')}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
{activePage === 'Invoices' && (
  <div>
    <h1>Invoices</h1>
    <p>View and manage all your invoices.</p>
    <h3>Total Invoices: {invoices.length}</h3>
  </div>
)}

{activePage === 'Approvals' && (
  <div>
    <h1>Approvals</h1>
    <p>Invoices waiting for approval.</p>
    <h3>Pending: {invoices.filter((invoice) => invoice.status === 'Pending').length}</h3>
  </div>
)}

{activePage === 'Payments' && (
  <div>
    <h1>Payments</h1>
    <p>Track invoice payment status.</p>
    <h3>Paid Invoices: {invoices.filter((invoice) => invoice.status === 'Paid').length}</h3>
  </div>
)}

{activePage === 'Reports' && (
  <div>
    <h1>Reports</h1>
    <p>Accounts payable summary.</p>
    <h3>Total Invoices: {invoices.length}</h3>
    <h3>Total Vendors: {new Set(invoices.map((invoice) => invoice.vendor)).size}</h3>
  </div>
)}

</div>
</div>
  )
}

export default App
