const socket = io('http://localhost:3000')

const messageForm = document.getElementById('send-container')

socket.on('chat-msg',data => {
    console.log(data)
})

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    const message = e.target.elements[0].value
    console.log(message)
    socket.emit('send-chat-message', message)
    // messageInput.value = ''
  })