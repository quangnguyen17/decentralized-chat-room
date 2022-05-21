import { ChangeEvent, useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import Gun from 'gun'
import { format, formatISO } from 'date-fns'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

TimeAgo.addDefaultLocale(en)

interface Message {
  username?: string
  message?: string
  createdAt?: string
  [key: string]: any
}

const gun = Gun({
  peers: ['http://localhost:4000/gun'],
})

const messagesRef = gun.get('messages')

const timeAgo = new TimeAgo('en-US')

const getTimeAgo = (date?: string) => (date ? timeAgo.format(new Date(date)) : '')

const App = () => {
  const [form, setForm] = useState<Message>({})
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    messagesRef.on((message) => setMessages((messages) => [...new Set<Message[]>([...messages, message])]))
  }, [setMessages])

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: '1rem',
          gap: '0.8rem',
          borderBottom: '0.5px solid rgb(42, 52, 64)',
        }}
      >
        <h3>Decentralized P2P Messaging</h3>
      </div>
      <div style={{ flex: 1, padding: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx}>{msg.message}</div>
        ))}
      </div>
      <form
        action="#"
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: '1rem',
          gap: '0.8rem',
          borderTop: '0.5px solid rgb(42, 52, 64)',
        }}
        onSubmit={(e) => {
          e.preventDefault()
          const message: Message = {
            message: form.message,
            username: form.username || uuid(),
            createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
          }
          console.log({ message })
          messagesRef.put(message)
          setMessages([...messages, message])
          setForm({})
        }}
      >
        <input
          style={{
            flex: 1,
            padding: '1rem',
            borderRadius: '0.6rem',
            border: '0.5px solid rgb(42, 52, 64)',
            fontSize: '1rem',
            outline: 0,
          }}
          name="message"
          value={form.message}
          onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
          placeholder="Type your message here..."
          required
        />
        <button
          type="submit"
          style={{
            cursor: 'pointer',
            padding: '0 1.2rem',
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
