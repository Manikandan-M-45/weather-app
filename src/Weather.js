import { useState } from "react";

const MessageAlert = () => {

  const [message, setMessage] = useState([]);
  const [notification, setNotification] = useState([]);

  const handleChange = (e) => {
    setMessage([...message, e.target.value]);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotification([...notification, message]);
    setMessage('');
  }

  return (
    <>
    <header style={{color: 'white'}}>{notification.length}<sup>+</sup> Notifications </header>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Enter your message" value={message} onChange={handleChange} />
        <button>send message</button>
      </form>
    </>
  )
}

export default MessageAlert;