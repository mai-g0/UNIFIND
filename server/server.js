const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')
const lostItemRoutes = require('./routes/lostItemRoutes')
const foundItemRoutes = require('./routes/foundItemRoutes')
const matchRoutes = require('./routes/matchRoutes')
const claimRoutes = require('./routes/claimRoutes')
const messageRoutes = require('./routes/messageRoutes')
const adminRoutes = require('./routes/adminRoutes')
const notificationRoutes = require('./routes/notificationRoutes')
const path = require('path')
const uploadRoutes = require('./routes/uploadRoutes')

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/api/auth', authRoutes)
app.use('/api/lost-items', lostItemRoutes)
app.use('/api/found-items', foundItemRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/claims', claimRoutes)
app.use('/api/messages', messageRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/uploads', uploadRoutes)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected')
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error.message)
  })

app.get('/', (req, res) => {
  res.send('UniFind API is running')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})