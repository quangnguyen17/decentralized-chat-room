import { FC, useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Message, messagesRef, getTimeAgo } from './gun'

const App: FC = () => {
  const [username, setUsername] = useState<string>(localStorage.getItem('username') || '')
  const [usernameInput, setUsernameInput] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    messagesRef.map().on((message) => setMessages((messages) => [...new Set<Message[]>([message, ...messages])]))
  }, [])

  if (!username) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: '1rem',
        }}
      >
        <h2 style={{ marginBottom: '2rem' }}>Enter your username:</h2>
        <form
          action="#"
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            gap: '0.8rem',
          }}
          onSubmit={(e) => {
            e.preventDefault()
            setUsername(usernameInput)
            localStorage.setItem('username', usernameInput)
            setUsernameInput('')
          }}
        >
          <input
            style={{
              flex: 1,
              fontSize: '1rem',
              padding: '0.8rem 1rem',
              borderRadius: '0.6rem',
              border: '0.5px solid rgb(42, 52, 64)',
              outline: 0,
            }}
            name="usernameInput"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
            placeholder="Enter your username here..."
            required
          />
          <button
            type="submit"
            style={{
              cursor: 'pointer',
              padding: '0.8rem',
              fontSize: '1rem',
              borderRadius: '0.6rem',
              border: '0.5px solid rgb(42, 52, 64)',
            }}
          >
            Continue
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: '0.8rem',
          gap: '0.8rem',
          borderBottom: '0.5px solid rgb(42, 52, 64)',
        }}
      >
        <h2>Decentralized Messaging 🕵️</h2>
        <button
          style={{
            fontSize: '0.8rem',
            padding: '0.6rem',
            borderRadius: '0.6rem',
            border: '0.5px solid rgb(42, 52, 64)',
          }}
          onClick={() => {
            setUsernameInput(username)
            setUsername('')
          }}
        >
          @{username} ✎
        </button>
      </div>
      <div style={{ flex: 1, padding: '1rem', overflow: 'auto' }}>
        {messages.map((msg, idx) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }} key={idx}>
            <div>
              <span>@{msg.username}</span>: <span style={{ opacity: 0.8 }}>{msg.message}</span>
            </div>
            <span>{getTimeAgo(msg.createdAt)}</span>
          </div>
        ))}
      </div>
      <form
        action="#"
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: '0.8rem',
          gap: '0.6rem',
          borderTop: '0.5px solid rgb(42, 52, 64)',
        }}
        onSubmit={(e) => {
          e.preventDefault()
          if (!message) return
          const date = new Date()
          messagesRef.get(date.toISOString()).put({ message, username, createdAt: format(date, "yyyy-MM-dd'T'HH:mm") })
          setMessage('')
        }}
      >
        <input
          style={{
            flex: 1,
            padding: '0.8rem',
            borderRadius: '0.6rem',
            border: '0.5px solid rgb(42, 52, 64)',
            fontSize: '1rem',
            outline: 0,
          }}
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          required
        />
        <button
          type="submit"
          style={{
            cursor: 'pointer',
            padding: '0 1rem',
            fontSize: '1rem',
            borderRadius: '0.6rem',
            border: '0.5px solid rgb(42, 52, 64)',
          }}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default App
