import { useSelector } from 'react-redux'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  const notif = useSelector(({ notification }) => {
    return notification
  })

  return (notif ? <div style={style}>{notif}</div> : null)
}

export default Notification
