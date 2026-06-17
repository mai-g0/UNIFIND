import { useEffect, useState } from 'react'

function Messages() {
  const [messages, setMessages] = useState([])
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [notice, setNotice] = useState('')

  const currentUser = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [])

  async function fetchMessages() {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      setMessages(data)

      if (data.length > 0 && !selectedMessage) {
        setSelectedMessage(data[0])
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  async function sendReply(event) {
    event.preventDefault()

    if (!selectedMessage) {
      return
    }

    const otherUser =
      selectedMessage.sender?._id === currentUser.id
        ? selectedMessage.receiver
        : selectedMessage.sender

    const token = localStorage.getItem('token')

    try {
      const response = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver: otherUser._id,
          itemName: selectedMessage.itemName,
          content: replyText,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setNotice(data.message || 'Reply could not be sent')
        return
      }

      setReplyText('')
      setNotice('')
      fetchMessages()
    } catch (error) {
      setNotice('Something went wrong. Please try again.')
    }
  }

  const selectedOtherUser =
    selectedMessage?.sender?._id === currentUser.id
      ? selectedMessage?.receiver
      : selectedMessage?.sender

  return (
    <main className="messages-page">
      <aside className="conversation-list">
        <h2>Messages</h2>

        {messages.length === 0 && (
          <div className="empty-state">No messages yet.</div>
        )}

        {[...new Map(messages.map((message) => {
          const otherUser =
            message.sender?._id === currentUser.id
              ? message.receiver
              : message.sender
          return [`${otherUser?._id}-${message.itemName}`, { message, otherUser }]
        })).values()].map(({ message, otherUser }) => (
          <button
            type="button"
            className="conversation conversation-button"
            key={`${otherUser?._id}-${message.itemName}`}
            onClick={() => setSelectedMessage(message)}
          >
            <h3>{otherUser?.fullName}</h3>
            <p>{message.itemName}</p>
            <span>{message.content}</span>
          </button>
        ))}
      </aside>

      <section className="chat-panel">
        <div className="chat-header">
          <h2>{selectedOtherUser?.fullName || 'Conversation'}</h2>
          <p>{selectedMessage?.itemName || 'Select or start a message from an item claim.'}</p>
        </div>

        {notice && <div className="form-message">{notice}</div>}

        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="empty-state">
              Messages will appear here after users contact each other.
            </div>
          )}

          {messages
            .filter((message) => {
              if (!selectedMessage) {
                return false
              }

              const sameItem = message.itemName === selectedMessage.itemName

              const samePeople =
                (message.sender?._id === currentUser.id ||
                  message.receiver?._id === currentUser.id)

              return sameItem && samePeople
            })
            .map((message) => (
              <div
  className={
    message.sender?._id?.toString() === currentUser.id?.toString()
      ? 'message sent'
      : message.sender?.role === 'admin'
      ? 'message admin'
      : 'message received'
  }
  key={message._id}
>
  {message.sender?.role === 'admin' && (
    <span className="admin-label">Admin</span>
  )}
  {message.content}
</div>
            ))}
        </div>

        <form className="message-form" onSubmit={sendReply}>
          <input
            type="text"
            placeholder="Type a reply..."
            value={replyText}
            onChange={(event) => setReplyText(event.target.value)}
            disabled={!selectedMessage}
            required
          />
          <button type="submit" disabled={!selectedMessage}>
            Send
          </button>
        </form>
      </section>
    </main>
  )
}

export default Messages