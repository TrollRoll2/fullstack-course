import { useContext, useEffect } from 'react'
import NotificationContext from '../NotificationContext'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  const { notification, notificationDispatch } = useContext(NotificationContext)

  useEffect(() => {

    if (notification) {
      setTimeout(() => notificationDispatch({type: 'CLEAR'}), 5000)
    }}, [notification, notificationDispatch]
  )

  if (!notification) return null

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
