const http = require("http");
const express = require("express");
const cors = require("cors");
const socketIO = require("socket.io");

const app=express();
const port=4500 || process.env.port;

let number_user;
const users=[{}];

app.use(cors());

app.get("/",(req,res)=>{
    res.send("our server is working properly");
})

const server=http.createServer(app);

const io=socketIO(server);
//if socket.broadcast then message is recieved by everyone ele other than person who send it eg.If A send the message then B,C,D will recieve the message
//if socket.emit message is recieve by person who send it eg. If A send message then A will recieve message 
//if io.emit then whole circuit will recieve the message

io.on("connect",(socket)=>{
    console.log("New Connection");
    socket.on('joined',({user})=>{
            number_user+=1;
          users[socket.id]=user;
          console.log(`${user} has joined `);
          socket.broadcast.emit('userJoined',{user:"Admin",message:` ${users[socket.id]} has joined`});
          socket.emit('welcome',{user:"Admin",message:`Welcome to the chat,${users[socket.id]} `})
    })

    socket.on('message',({message,id})=>{
        io.emit('sendMessage',{user:users[id],message,id});
    })

    socket.on('disconnect',()=>{
        number_user-=1;
        socket.broadcast.emit('leave',{user:"Admin",message:`${users[socket.id]}  has left`});
        console.log(`${users[socket.id]} left`);
    })
});


server.listen(port,()=>{
    console.log(`sever is running on http://localhost:${port}`)
})