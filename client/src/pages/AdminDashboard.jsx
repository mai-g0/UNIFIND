import { useEffect, useState } from 'react'

function AdminDashboard() {
  const [claims, setClaims] = useState([])
  const [selectedClaim, setSelectedClaim] = useState(null)
  const [messageText, setMessageText] = useState('')
  const [notice, setNotice] = useState('')
  const [stats, setStats] = useState({
  totalUsers: 0,
  lostItems: 0,
  foundItems: 0,
  claims: 0,
})
  const [statusFilter, setStatusFilter] = useState('all')
  const [adminSearchTerm, setAdminSearchTerm] = useState('')

  useEffect(() => {
    fetchClaims()
    fetchStats()
  }, [])

  async function fetchStats() {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch('http://localhost:5000/api/admin/stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()
    setStats(data)
  } catch (error) {
    console.log(error.message)
  }
}

  async function fetchClaims() {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('http://localhost:5000/api/claims', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      setClaims(data)
    } catch (error) {
      console.log(error.message)
    }
  }

  async function updateClaimStatus(claimId, status) {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`http://localhost:5000/api/claims/${claimId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchClaims()
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  async function sendMessage(event) {
  event.preventDefault()

  if (!selectedClaim) {
    return
  }

  if (!selectedClaim.claimant?._id) {
    setNotice('Cannot send message because claimant ID is missing')
    return
  }

  const token = localStorage.getItem('token')

  try {
    const response = await fetch('http://localhost:5000/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        receiver: selectedClaim.claimant._id,
        itemName: selectedClaim.foundItem?.itemName,
        content: messageText,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      setNotice(data.message || 'Message could not be sent')
      return
    }

    setNotice('Message sent successfully')
    setMessageText('')
    setSelectedClaim(null)
  } catch (error) {
    setNotice('Something went wrong. Please try again.')
  }
}

  const pendingClaims = claims.filter((claim) => claim.status === 'pending').length
  const approvedClaims = claims.filter((claim) => claim.status === 'approved').length
  const rejectedClaims = claims.filter((claim) => claim.status === 'rejected').length

  const filteredClaims = claims.filter((claim) => {
  const matchesStatus =
    statusFilter === 'all' || claim.status === statusFilter

  const searchText = adminSearchTerm.toLowerCase()

  const matchesSearch =
    claim.lostItem?.itemName?.toLowerCase().includes(searchText) ||
    claim.foundItem?.itemName?.toLowerCase().includes(searchText) ||
    claim.claimant?.fullName?.toLowerCase().includes(searchText) ||
    claim.proofOfOwnership?.toLowerCase().includes(searchText) ||
    claim.status?.toLowerCase().includes(searchText)

  return matchesStatus && matchesSearch
})
  return (
    <main className="admin-page">
      <section className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Review claim requests and verify ownership proof.</p>
      </section>

      {notice && <div className="form-message">{notice}</div>}

      <section className="admin-stats">
        <div>
          <h2>{stats.totalUsers}</h2>
          <p>Total Users</p>
        </div>

        <div>
          <h2>{stats.lostItems}</h2>
          <p>Lost Items</p>
        </div>

        <div>
          <h2>{stats.foundItems}</h2>
          <p>Found Items</p>
        </div>

        <div>
          <h2>{stats.claims}</h2>
          <p>Total Claims</p>
        </div>

        <div>
          <h2>{pendingClaims}</h2>
          <p>Pending</p>
        </div>

        <div>
          <h2>{approvedClaims}</h2>
          <p>Approved</p>
        </div>

        <div>
          <h2>{rejectedClaims}</h2>
          <p>Rejected</p>
        </div>
      </section>

      <section className="admin-panel">
        <h2>Claim Requests</h2>

        <select
  className="filter-select"
  value={statusFilter}
  onChange={(event) => setStatusFilter(event.target.value)}
>
  <option value="all">All Claims</option>
  <option value="pending">Pending</option>
  <option value="approved">Approved</option>
  <option value="rejected">Rejected</option>
  <option value="needs_more_proof">Needs More Proof</option>
</select>

<input
  className="search-input admin-search"
  type="text"
  placeholder="Search claims..."
  value={adminSearchTerm}
  onChange={(event) => setAdminSearchTerm(event.target.value)}
/>

        {filteredClaims.length === 0 && (
          <div className="empty-state">No claims submitted yet.</div>
        )}

        <div className="admin-table">
          <div className="admin-row admin-head">
            <span>Lost Item</span>
            <span>Found Item</span>
            <span>Claimant</span>
            <span>Status</span>
            <span>Proof</span>
            <span>Actions</span>
          </div>

          {filteredClaims.map((claim) => (
            <div className="admin-row" key={claim._id}>
              <span>{claim.lostItem?.itemName}</span>
              <span>{claim.foundItem?.itemName}</span>
              <span>{claim.claimant?.fullName}</span>
              <span>{claim.status}</span>

              <div className="admin-proof">
  <div className="proof-images">
    {claim.lostItem?.image && (
      <img
        src={`http://localhost:5000${claim.lostItem.image}`}
        alt={claim.lostItem.itemName}
      />
    )}

    {claim.foundItem?.image && (
      <img
        src={`http://localhost:5000${claim.foundItem.image}`}
        alt={claim.foundItem.itemName}
      />
    )}
  </div>

  <p>{claim.proofOfOwnership}</p>
</div>

              <div className="admin-actions">
                <button onClick={() => updateClaimStatus(claim._id, 'approved')}>
                  Approve
                </button>

                <button onClick={() => updateClaimStatus(claim._id, 'rejected')}>
                  Reject
                </button>

                <button onClick={() => updateClaimStatus(claim._id, 'needs_more_proof')}>
                  Need Proof
                </button>

                <button onClick={() => setSelectedClaim(claim)}>
                  Contact
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedClaim && (
        <section className="claim-box">
          <h2>Contact Claimant</h2>
          <p>
            Sending message to {selectedClaim.claimant?.fullName} about{' '}
            {selectedClaim.foundItem?.itemName}
          </p>

          <form onSubmit={sendMessage}>
            <label>Message</label>
            <textarea
              placeholder="Write your message..."
              value={messageText}
              onChange={(event) => setMessageText(event.target.value)}
              required
            ></textarea>

            <div className="claim-actions">
              <button type="submit">Send Message</button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setSelectedClaim(null)}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  )
}

export default AdminDashboard