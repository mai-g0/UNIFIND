import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Dashboard() {
  const [stats, setStats] = useState({
    lostReports: 0,
    foundReports: 0,
    activeClaims: 0,
    messages: 0,
  })

  const [lostItems, setLostItems] = useState([])
  const [foundItems, setFoundItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [editType, setEditType] = useState('')
  const [editForm, setEditForm] = useState({})
  const [editImageFile, setEditImageFile] = useState(null)

  const currentUser = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    async function fetchDashboardData() {
      const token = localStorage.getItem('token')

      try {
        const [lostResponse, foundResponse] = await Promise.all([
          fetch('http://localhost:5000/api/lost-items', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          fetch('http://localhost:5000/api/found-items', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ])

        const lostData = await lostResponse.json()
        const foundData = await foundResponse.json()

        const myLostItems = lostData.filter(
          (item) => item.reportedBy?._id === currentUser.id
        )

        const myFoundItems = foundData.filter(
          (item) => item.reportedBy?._id === currentUser.id
        )

        setLostItems(myLostItems)
        setFoundItems(myFoundItems)

        setStats({
          lostReports: myLostItems.length,
          foundReports: myFoundItems.length,
          activeClaims: 0,
          messages: 0,
        })
      } catch (error) {
        console.log(error.message)
      }
    }

    fetchDashboardData()
  }, [currentUser.id])

  const filteredLostItems = lostItems.filter((item) => {
    const searchText = searchTerm.toLowerCase()

    return (
      item.itemName.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText) ||
      item.description.toLowerCase().includes(searchText) ||
      item.lastSeenLocation.toLowerCase().includes(searchText) ||
      item.status.toLowerCase().includes(searchText)
    )
  })

  const filteredFoundItems = foundItems.filter((item) => {
    const searchText = searchTerm.toLowerCase()

    return (
      item.itemName.toLowerCase().includes(searchText) ||
      item.category.toLowerCase().includes(searchText) ||
      item.description.toLowerCase().includes(searchText) ||
      item.foundLocation.toLowerCase().includes(searchText) ||
      item.status.toLowerCase().includes(searchText)
    )
  })

  function startEdit(item, type) {
    setEditingItem(item._id)
    setEditType(type)
    setEditForm(item)
    setEditImageFile(null)
  }

  async function uploadEditImage(token) {
    if (!editImageFile) {
      return editForm.image || ''
    }

    const imageData = new FormData()
    imageData.append('image', editImageFile)

    const response = await fetch('http://localhost:5000/api/uploads', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: imageData,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Image upload failed')
    }

    return data.imageUrl
  }

  async function saveEdit(event) {
    event.preventDefault()

    const token = localStorage.getItem('token')
    const endpoint =
      editType === 'lost'
        ? `http://localhost:5000/api/lost-items/${editingItem}`
        : `http://localhost:5000/api/found-items/${editingItem}`

    try {
      const imageUrl = await uploadEditImage(token)

      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...editForm,
          image: imageUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message || 'Could not update report')
        return
      }

      if (editType === 'lost') {
        setLostItems(
          lostItems.map((item) =>
            item._id === editingItem ? data.lostItem : item
          )
        )
        setMessage('Lost item updated successfully')
      } else {
        setFoundItems(
          foundItems.map((item) =>
            item._id === editingItem ? data.foundItem : item
          )
        )
        setMessage('Found item updated successfully')
      }

      setEditingItem(null)
      setEditType('')
      setEditForm({})
      setEditImageFile(null)
    } catch (error) {
      setMessage(error.message || 'Something went wrong. Please try again.')
    }
  }

  async function deleteLostItem(itemId) {
    const token = localStorage.getItem('token')
    const confirmDelete = window.confirm('Delete this lost item report?')

    if (!confirmDelete) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/lost-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setLostItems(lostItems.filter((item) => item._id !== itemId))
        setStats((currentStats) => ({
          ...currentStats,
          lostReports: currentStats.lostReports - 1,
        }))
        setMessage('Lost item deleted successfully')
        return
      }

      const data = await response.json()
      setMessage(data.message || 'Could not delete lost item')
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    }
  }

  async function deleteFoundItem(itemId) {
    const token = localStorage.getItem('token')
    const confirmDelete = window.confirm('Delete this found item report?')

    if (!confirmDelete) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/found-items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setFoundItems(foundItems.filter((item) => item._id !== itemId))
        setStats((currentStats) => ({
          ...currentStats,
          foundReports: currentStats.foundReports - 1,
        }))
        setMessage('Found item deleted successfully')
        return
      }

      const data = await response.json()
      setMessage(data.message || 'Could not delete found item')
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    }
  }

  function renderEditForm() {
    return (
      <form className="edit-form" onSubmit={saveEdit}>
        <input
          type="text"
          value={editForm.itemName || ''}
          onChange={(event) =>
            setEditForm({ ...editForm, itemName: event.target.value })
          }
        />

        <select
          value={editForm.category || ''}
          onChange={(event) =>
            setEditForm({ ...editForm, category: event.target.value })
          }
        >
          <option value="">Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
          <option value="Cards/Documents">Cards/Documents</option>
          <option value="Keys">Keys</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          value={editForm.description || ''}
          onChange={(event) =>
            setEditForm({ ...editForm, description: event.target.value })
          }
        ></textarea>

        <input
          type="date"
          value={
            editType === 'lost'
              ? editForm.dateLost?.slice(0, 10) || ''
              : editForm.dateFound?.slice(0, 10) || ''
          }
          onChange={(event) =>
            setEditForm(
              editType === 'lost'
                ? { ...editForm, dateLost: event.target.value }
                : { ...editForm, dateFound: event.target.value }
            )
          }
        />

        <input
          type="text"
          value={
            editType === 'lost'
              ? editForm.lastSeenLocation || ''
              : editForm.foundLocation || ''
          }
          onChange={(event) =>
            setEditForm(
              editType === 'lost'
                ? { ...editForm, lastSeenLocation: event.target.value }
                : { ...editForm, foundLocation: event.target.value }
            )
          }
        />

        <input
          type="file"
          accept="image/*"
          onChange={(event) => setEditImageFile(event.target.files[0])}
        />

        <div className="edit-actions">
          <button type="submit">Save</button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setEditingItem(null)
              setEditType('')
              setEditForm({})
              setEditImageFile(null)
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    )
  }

  return (
    <main className="dashboard">
      <section className="dashboard-header">
        <div>
          <h1>User Dashboard</h1>
          <p>Manage your lost items, found items, claims, and messages.</p>
        </div>
      </section>

      {message && <div className="form-message">{message}</div>}

      <input
        className="search-input"
        type="text"
        placeholder="Search your reports..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <section className="dashboard-actions">
        <Link to="/post-lost" className="action-card">
          <h3>Report Lost Item</h3>
          <p>Create a report for an item you lost.</p>
        </Link>

        <Link to="/post-found" className="action-card">
          <h3>Report Found Item</h3>
          <p>Post an item you found so the owner can claim it.</p>
        </Link>

        <Link to="/matches" className="action-card">
          <h3>Potential Matches</h3>
          <p>View possible matches between lost and found items.</p>
        </Link>

        <Link to="/claims" className="action-card">
          <h3>Claims</h3>
          <p>Track ownership claims and verification status.</p>
        </Link>

        <Link to="/messages" className="action-card">
          <h3>Messages</h3>
          <p>Chat with users about item recovery.</p>
        </Link>
      </section>

      <section className="dashboard-summary">
        <div>
          <h2>{stats.lostReports}</h2>
          <p>My Lost Reports</p>
        </div>

        <div>
          <h2>{stats.foundReports}</h2>
          <p>My Found Reports</p>
        </div>

        <div>
          <h2>{stats.activeClaims}</h2>
          <p>Active Claims</p>
        </div>

        <div>
          <h2>{stats.messages}</h2>
          <p>Messages</p>
        </div>
      </section>

      <section className="report-section">
        <h2>My Lost Reports</h2>

        {filteredLostItems.length === 0 && (
          <div className="empty-state">You have not reported any lost items yet.</div>
        )}

        <div className="report-grid">
          {filteredLostItems.map((item) => (
            <article className="report-card" key={item._id}>
              {item.image && (
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.itemName}
                  className="report-image"
                />
              )}

              <h3>{item.itemName}</h3>
              <p>{item.description}</p>

              <div className="report-meta">
                <span>{item.category}</span>
                <span className={`item-status ${item.status}`}>{item.status}</span>
              </div>

              <small>{item.lastSeenLocation}</small>

              {item.status === 'claimed' && (
  <p className="locked-note">This item is locked because its claim was approved.</p>
)}

              {item.status !== 'claimed' && (
                <>
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => startEdit(item, 'lost')}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteLostItem(item._id)}
                  >
                    Delete
                  </button>
                </>
              )}

              {editingItem === item._id && renderEditForm()}
            </article>
          ))}
        </div>
      </section>

      <section className="report-section">
        <h2>My Found Reports</h2>

        {filteredFoundItems.length === 0 && (
          <div className="empty-state">You have not reported any found items yet.</div>
        )}

        <div className="report-grid">
          {filteredFoundItems.map((item) => (
            <article className="report-card" key={item._id}>
              {item.image && (
                <img
                  src={`http://localhost:5000${item.image}`}
                  alt={item.itemName}
                  className="report-image"
                />
              )}

              <h3>{item.itemName}</h3>
              <p>{item.description}</p>

              <div className="report-meta">
                <span>{item.category}</span>
                <span className={`item-status ${item.status}`}>{item.status}</span>
              </div>

              <small>{item.foundLocation}</small>

              {item.status === 'claimed' && (
  <p className="locked-note">This item is locked because its claim was approved.</p>
)}

              {item.status !== 'claimed' && (
                <>
                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => startEdit(item, 'found')}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => deleteFoundItem(item._id)}
                  >
                    Delete
                  </button>
                </>
              )}

              {editingItem === item._id && renderEditForm()}
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Dashboard