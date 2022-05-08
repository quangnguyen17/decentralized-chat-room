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

const getTimeAgo = (date?: string) => timeAgo.format(date ? new Date(date) : new Date())

const App = () => {
  const [form, setForm] = useState<Message>({})
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    messagesRef.on((message) => setMessages([...new Set<Message[]>([...messages, message])]))
  }, [])

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <div>
      <h1>Decentralized P2P Chat Room</h1>
      <hr />
      <section>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            // const newMsg: Message = {
            //   message: form.message,
            //   username: form.username || uuid(),
            //   createdAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
            // }
            // console.log({ newMsg })
            // setMessages([...messages, newMsg])
            // messagesRef.set(newMsg)wfe
            setForm({})
          }}
        >
          <label htmlFor="username">username: </label>
          <input
            type="text"
            name="username"
            placeholder="username (optional)"
            value={form.username}
            onChange={onInputChange}
          />
          <br />
          <label htmlFor="message">message: </label>
          <input
            required
            type="text"
            name="message"
            placeholder="your message here..."
            value={form.message}
            onChange={onInputChange}
          />
          <br />
          <button>Send</button>
        </form>
      </section>
      <hr />
      <section>
        <h4>Messages ({messages.length})</h4>
        <ul>
          {messages.map(({ message, username, createdAt }, index) => (
            <li key={index}>
              {message} - {username} @ {getTimeAgo(createdAt)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default App
