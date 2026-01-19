const Notification = ({message, notifType}) => {
    if (message === null) {
        return null
    }

    return (
        <div className={notifType}>
            {message}
        </div>
    )
}

export default Notification