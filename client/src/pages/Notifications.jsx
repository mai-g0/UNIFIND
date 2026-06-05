import { useEffect, useState } from 'react'

function Notifications() {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    fetchNotifications()
  }, [])

  async function fetchNotifications() {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch('http://localhost:5000/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.log(error.message)
    }
  }

  async function markAsRead(notificationId) {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(
        `http://localhost:5000/api/notifications/${notificationId}/read`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
  fetchNotifications()
  window.dispatchEvent(new Event('notificationsUpdated'))
}
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <main className="notifications-page">
      <section className="page-header">
        <h1>Notifications</h1>
        <p>Stay updated on claim decisions and account activity.</p>
      </section>

      <section className="notifications-list">
        {notifications.length === 0 && (
          <div className="empty-state">No notifications yet.</div>
        )}

        {notifications.map((notification) => (
          <article
            className={
              notification.isRead
                ? 'notification-card read'
                : 'notification-card'
            }
            key={notification._id}
          >
            <div>
              <h3>{notification.title}</h3>
              <p>{notification.message}</p>
              <small>{new Date(notification.createdAt).toLocaleString()}</small>
            </div>

            {!notification.isRead && (
              <button onClick={() => markAsRead(notification._id)}>
                Mark Read
              </button>
            )}
          </article>
        ))}
      </section>
    </main>
  )
}

export default Notifications