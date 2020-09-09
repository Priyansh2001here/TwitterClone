const express = require('express')
let app = express()
let server = app.listen(3000)
const fetch = require('node-fetch')
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

const cors = require('cors')
app.use(cors())


io.on('connection', socket => {
    socket.emit('chat-msg', 'hello world')
    const jwt = socket.request.headers.authorization
    const auth_token = "JWT " + jwt
    socket.on('send-chat-message', (data) => {

        socket.broadcast.emit(data)

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

        console.log(myData)

        fetch('http://127.0.0.1:8000/chat/index', options)

    })
})
