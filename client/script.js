import { io } from 'socket.io-client'

const joinRoomBtn = document.getElementById('room-button')
const messageInput = document.getElementById('message-input')
const roomInput = document.getElementById('room-input')
const form = document.getElementById('form')

const socket = io('http://localhost:3000')
const userSocket = io('http://localhost:3000/user', {
  auth: { token: 'test' }
})
userSocket.on('connect_error', err => {
  displayMessage(err)
})
socket.on('connect', () => {
  displayMessage(`You connected with id: ${socket.id}`)
})
socket.on('receive-message', message => {
  displayMessage(message)
})

form.addEventListener('submit', e => {
  e.preventDefault()

  const message = messageInput.value
  const room = roomInput.value

  if (message === '') {
    return
  }

  displayMessage(message)
  socket.emit('send-message', message, room)
  messageInput.value = ''
})

joinRoomBtn.addEventListener('click', () => {
  const room = roomInput.value
  socket.emit('join-room', room, msg => {
    displayMessage(msg)
  })
})

function displayMessage(msg) {
  const div = document.createElement('div')
  div.textContent = msg
  document.getElementById('message-container').append(div)
}
