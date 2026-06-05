import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function PostFoundItem() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    description: '',
    foundLocation: '',
    dateFound: '',
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

      const response = await fetch('http://localhost:5000/api/found-items', {
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

      setMessage('Found item reported successfully')
      navigate('/dashboard')
    } catch (error) {
      setMessage(error.message || 'Something went wrong. Please try again.')
    }
  }

  return (
    <main className="form-page">
      <form className="item-form" onSubmit={handleSubmit}>
        <h1>Report Found Item</h1>
        <p>Post details about an item you found so the owner can identify it.</p>

        {message && <div className="form-message">{message}</div>}

        <label>Item Name</label>
        <input
          type="text"
          name="itemName"
          placeholder="Example: Student ID card"
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

        <label>Found Location</label>
        <input
          type="text"
          name="foundLocation"
          placeholder="Example: Cafeteria entrance"
          value={formData.foundLocation}
          onChange={handleChange}
          required
        />

        <label>Date Found</label>
        <input
          type="date"
          name="dateFound"
          value={formData.dateFound}
          onChange={handleChange}
          required
        />

        <label>Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setImageFile(event.target.files[0])}
        />

        <button type="submit">Submit Found Item</button>
      </form>
    </main>
  )
}

export default PostFoundItem