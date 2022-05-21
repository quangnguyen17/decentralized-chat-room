import Gun from 'gun'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'

export interface Message {
  username?: string
  message?: string
  createdAt?: string
  [key: string]: any
}

export const db = Gun()
export const messagesRef = db.get('messages')

TimeAgo.addDefaultLocale(en)

const timeAgo = new TimeAgo('en-US')
export const getTimeAgo = (date?: string) => (date ? timeAgo.format(new Date(date)) : '')
