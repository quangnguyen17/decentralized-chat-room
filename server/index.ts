import express from 'express'
import gun from 'gun'

const PORT = process.env.PORT || 4000

const app = express()

app.listen(PORT, () => {
  console.log(`Gun server listening on port ${PORT}.`)
})

gun({ web: app })
