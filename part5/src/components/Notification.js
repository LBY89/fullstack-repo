const Notification = ({ message }) => {

  const mystyle = {
    color: 'red'
  }

  if (message === null) {
    return null
  }

  return (
    <div className="error" style={mystyle} >
      {message}
    </div>
  )
}

export default Notification