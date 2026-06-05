import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function PostLostItem() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    description: '',
    lastSeenLocation: '',
    dateLost: '',
    image: '',
  })

  const [imageFile, setImageFile] = useState(null)
  const [message, setMessage] = useState('')

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  async function uploadImage(token) {
    if (!imageFile) {
      return ''
    }

    const imageData = new FormData()
    imageData.append('image', imageFile)

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

  async function handleSubmit(event) {
    event.preventDefault()

    const token = localStorage.getItem('token')

    try {
      const imageUrl = await uploadImage(token)

      const response = await fetch('http://localhost:5000/api/lost-items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.message)
        return
      }

      setMessage('Lost item reported successfully')
      navigate('/dashboard')
    } catch (error) {
      setMessage(error.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <main className="form-page">
      <form className="item-form" onSubmit={handleSubmit}>
        <h1>Report Lost Item</h1>
        <p>Share details about the item you lost so UniFind can help match it.</p>

        {message && <div className="form-message">{message}</div>}

        <label>Item Name</label>
        <input
          type="text"
          name="itemName"
          placeholder="Example: Black wallet"
          value={formData.itemName}
          onChange={handleChange}
          required
        />

        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select category</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
          <option value="Cards/Documents">Cards/Documents</option>
          <option value="Keys">Keys</option>
          <option value="Other">Other</option>
        </select>

        <label>Description</label>
        <textarea
          name="description"
          placeholder="Describe the item clearly"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <label>Last Seen Location</label>
        <input
          type="text"
          name="lastSeenLocation"
          placeholder="Example: Library, Room 204"
          value={formData.lastSeenLocation}
          onChange={handleChange}
          required
        />

        <label>Date Lost</label>
        <input
          type="date"
          name="dateLost"
          value={formData.dateLost}
          onChange={handleChange}
          required
        />

        <label>Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files[0])}
        />

        <button type="submit">Submit Lost Item</button>
      </form>
    </main>
  )
}

export default PostLostItem