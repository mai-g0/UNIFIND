import { useEffect, useState } from 'react'

function Matches() {
  const [matches, setMatches] = useState([])
  const [selectedMatch, setSelectedMatch] = useState(null)
  const [proofOfOwnership, setProofOfOwnership] = useState('')
  const [message, setMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchMatches() {
      const token = localStorage.getItem('token')

      try {
        const response = await fetch('http://localhost:5000/api/matches', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()
        setMatches(data)
      } catch (error) {
        console.log(error.message)
      }
    }

    fetchMatches()
  }, [])

  async function handleClaimSubmit(event) {
    event.preventDefault()

    if (!selectedMatch) {
      return
    }

    const token = localStorage.getItem('token')

    try {
      const response = await fetch('http://localhost:5000/api/claims', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lostItem: selectedMatch.lostItemId,
          foundItem: selectedMatch.foundItemId,
          proofOfOwnership,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message)
        return
      }

      setMessage('Claim submitted successfully')
      setSelectedMatch(null)
      setProofOfOwnership('')
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    }
  }

  const filteredMatches = matches.filter((match) => {
  const searchText = searchTerm.toLowerCase()

  return (
    match.lostItem.toLowerCase().includes(searchText) ||
    match.foundItem.toLowerCase().includes(searchText) ||
    match.category.toLowerCase().includes(searchText) ||
    match.location.toLowerCase().includes(searchText)
  )
})

  return (
    <main className="matches-page">
      <section className="page-header">
        <h1>Potential Matches</h1>
        <p>Review possible matches between reported lost and found items.</p>
      </section>
      <input
  className="search-input"
  type="text"
  placeholder="Search by item, category, or location..."
  value={searchTerm}
  onChange={(event) => setSearchTerm(event.target.value)}
/>

      {message && <div className="form-message">{message}</div>}

      <section className="matches-list">
        {filteredMatches.length === 0 && (
          <div className="empty-state">No potential matches found yet.</div>
        )}

        {filteredMatches.map((match) => (
          <div className="match-card" key={match.id}>
           <div>
  {match.lostImage && (
    <img
      src={`http://localhost:5000${match.lostImage}`}
      alt={match.lostItem}
      className="match-image"
    />
  )}
  <h3>{match.lostItem}</h3>
  <p>Lost item</p>
</div>

<div>
  {match.foundImage && (
    <img
      src={`http://localhost:5000${match.foundImage}`}
      alt={match.foundItem}
      className="match-image"
    />
  )}
  <h3>{match.foundItem}</h3>
  <p>Found item</p>
</div>

            <div>
              <h3>{match.location}</h3>
              <p>Location</p>
            </div>

            <div>
              <h3>{match.matchScore}</h3>
              <p>{match.status}</p>
            </div>

            <button onClick={() => setSelectedMatch(match)}>View Match</button>
          </div>
        ))}
      </section>

      {selectedMatch && (
        <section className="claim-box">
          <h2>Submit Claim</h2>
          <p>
            Claiming: {selectedMatch.foundItem} matched with {selectedMatch.lostItem}
          </p>

          <form onSubmit={handleClaimSubmit}>
            <label>Proof of Ownership</label>
            <textarea
              placeholder="Example: Describe unique marks, contents, serial number, or other proof."
              value={proofOfOwnership}
              onChange={(event) => setProofOfOwnership(event.target.value)}
              required
            ></textarea>

            <div className="claim-actions">
              <button type="submit">Submit Claim</button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setSelectedMatch(null)}
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

export default Matches