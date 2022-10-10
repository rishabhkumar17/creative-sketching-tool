const express = require('express')
const app = express()

const server = require('http').createServer(app)
const { Server } = require('socket.io')

const { addUser } = require('./utils/users')

const io = new Server(server)

app.get('/', (req, res) => {
  res.send('This is creative drawing tool app server by Rishabh Kumar')
})

let roomIdGlobal, imgURLGlobal

io.on('connection', (socket) => {
  socket.on('userJoined', (data) => {
    const { name, userId, roomId, host, presenter } = data
    roomIdGlobal = roomId
    socket.join(roomId)
    const users = addUser(data)
    socket.emit('userIsJoined', { success: true, users })
    socket.broadcast.to(roomId).emit('allUsers', users)
    socket.broadcast.to(roomId).emit('whiteBoardDataResponse', {
      imgURL: imgURLGlobal,
    })
  })
  socket.on('whiteBoardData', (data) => {
    imgURLGlobal = data
    socket.broadcast.to(roomIdGlobal).emit('whiteBoardDataResponse', {
      imgURL: data,
    })
  })
})

const port = process.env.PORT || 5000

server.listen(port, () =>
  console.log('server is running on http://localhost:5000')
)
