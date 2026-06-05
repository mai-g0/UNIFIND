import { useEffect, useState } from 'react'

function Claims() {
  const [claims, setClaims] = useState([])

  useEffect(() => {
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

    fetchClaims()
  }, [])

  function formatStatus(status) {
    return status.replaceAll('_', ' ')
  }

  return (
    <main className="claims-page">
      <section className="page-header">
        <h1>Claims</h1>
        <p>Track item claim requests and proof of ownership verification.</p>
      </section>

      <section className="claims-grid">
        {claims.length === 0 && (
          <div className="empty-state">No claims submitted yet.</div>
        )}

        {claims.map((claim) => (
          <article className="claim-card" key={claim._id}>
            <div className="claim-card-header">
              <div>
                <h2>{claim.foundItem?.itemName}</h2>
                <p>Matched with lost item: {claim.lostItem?.itemName}</p>
              </div>

              <span className={`status-pill ${claim.status}`}>
                {formatStatus(claim.status)}
              </span>
            </div>

            <div className="claim-details">
              <div>
                <strong>Claimant</strong>
                <span>{claim.claimant?.fullName}</span>
              </div>

              <div>
                <strong>Found Location</strong>
                <span>{claim.foundItem?.foundLocation}</span>
              </div>

              <div>
                <strong>Date Submitted</strong>
                <span>{new Date(claim.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="proof-box">
              <strong>Proof of Ownership</strong>
              <p>{claim.proofOfOwnership}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Claims