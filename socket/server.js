const djangoPORT = '8000'
const host = '127.0.0.1'


const express = require('express')
let app = express()
let server = app.listen(3000, host)
const fetch = require('node-fetch')
const cors = require('cors')
app.use(cors())


const io = require("socket.io")(server, {
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin,
            "Access-Control-Allow-Credentials": true
        }
        res.writeHead(200, headers)
        res.end()
    }
})


const sendmessage = async (socket, data, auth_token) => {

    const myData = JSON.stringify(
        {
            'message': data
        }
    )

    const options = {
        method: 'POST',
        headers: {
            Authorization: auth_token,
            'Content-Type': 'application/json'
        },
        body: myData
    }

    let resp = await fetch(`http://${host}:${djangoPORT}/chat/message`, options)
    resp = await resp.json()

    const userMessage = {
        message: data,
        username: resp.username,
        id: resp.id
    }

    socket.broadcast.emit('chat-message', userMessage)
}


io.on('connection', socket => {
    socket.emit('chat-msg', 'hello world')
    const jwt = socket.request.headers.authorization
    const auth_token = "JWT " + jwt
    socket.on('send-chat-message', (data) => {

        sendmessage(socket, data, auth_token)

        console.log(data)

    })
})
