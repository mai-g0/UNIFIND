import { useEffect, useState } from 'react'

function Feed() {
  const [lostItems, setLostItems] = useState([])
  const [foundItems, setFoundItems] = useState([])
  const [activeTab, setActiveTab] = useState('lost')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
    const interval = setInterval(fetchItems, 5000)
    return () => clearInterval(interval)
  }, [])

  async function fetchItems() {
    const token = localStorage.getItem('token')

    try {
      const [lostResponse, foundResponse] = await Promise.all([
        fetch('http://localhost:5000/api/lost-items', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/found-items', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const lostData = await lostResponse.json()
      const foundData = await foundResponse.json()

      setLostItems(lostData)
      setFoundItems(foundData)
      setLoading(false)
    } catch (error) {
      console.log(error.message)
      setLoading(false)
    }
  }

  const filteredLost = lostItems.filter((item) => {
    const text = searchTerm.toLowerCase()
    return (
      item.itemName?.toLowerCase().includes(text) ||
      item.category?.toLowerCase().includes(text) ||
      item.description?.toLowerCase().includes(text) ||
      item.lastSeenLocation?.toLowerCase().includes(text)
    )
  })

  const filteredFound = foundItems.filter((item) => {
    const text = searchTerm.toLowerCase()
    return (
      item.itemName?.toLowerCase().includes(text) ||
      item.category?.toLowerCase().includes(text) ||
      item.description?.toLowerCase().includes(text) ||
      item.foundLocation?.toLowerCase().includes(text)
    )
  })

  const items = activeTab === 'lost' ? filteredLost : filteredFound

  return (
    <main className="feed-page">
      <section className="feed-header">
        <h1>Live Feed</h1>
        <p>Browse all lost and found reports on campus in real time.</p>
      </section>

      <div className="feed-controls">
        <div className="feed-tabs">
          <button
            className={activeTab === 'lost' ? 'feed-tab active' : 'feed-tab'}
            onClick={() => setActiveTab('lost')}
          >
            Lost Items ({lostItems.length})
          </button>
          <button
            className={activeTab === 'found' ? 'feed-tab active' : 'feed-tab'}
            onClick={() => setActiveTab('found')}
          >
            Found Items ({foundItems.length})
          </button>
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Search by name, category, location..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {loading && (
        <div className="empty-state">Loading reports...</div>
      )}

      {!loading && items.length === 0 && (
        <div className="empty-state">No reports found.</div>
      )}

      <div className="feed-grid">
        {items.map((item) => (
          <article className="feed-card" key={item._id}>
           {item.image ? (
  <img
    src={`http://localhost:5000${item.image}`}
    alt={item.itemName}
    className="feed-image"
  />
) : (
  <div className="feed-image-placeholder">
    {item.category === 'Electronics' ? '💻' :
     item.category === 'Books' ? '📚' :
     item.category === 'Clothing' ? '👕' :
     item.category === 'Keys' ? '🔑' :
     item.category === 'Cards/Documents' ? '🪪' : '📦'}
  </div>
)}

            <div className="feed-card-body">
              <div className="feed-card-top">
                <h3>{item.itemName}</h3>
                <span className={`item-status ${item.status}`}>
                  {item.status}
                </span>
              </div>

              <p>{item.description}</p>

              <div className="feed-meta">
                <span>📁 {item.category}</span>
                <span>
                  📍 {activeTab === 'lost'
                    ? item.lastSeenLocation
                    : item.foundLocation}
                </span>
                <span>
                  📅 {new Date(
                    activeTab === 'lost' ? item.dateLost : item.dateFound
                  ).toLocaleDateString()}
                </span>
              </div>

              <div className="feed-reporter">
                Reported by <strong>{item.reportedBy?.fullName}</strong>
              </div>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

export default Feed