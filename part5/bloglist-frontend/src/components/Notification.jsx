const Notification = ({ notification }) => {

  if (notification) {
    return (
      <div className={notification.type}>
        {notification.message}
      </div>
    )
  }

  return null
}

export default Notification