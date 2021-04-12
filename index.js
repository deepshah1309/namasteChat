const express=require('express');
const app=express();
const cors=require('cors');
const socket=require('socket.io');
//const mongoose=require('mongoose');
app.use(express.json())
app.use(cors())
// mongoose.connect("mongodb://localhost:27017/shopping",{ useNewUrlParser: true ,useUnifiedTopology: true}).then((res)=>{
// console.log("mongoose is up");
// }).catch((err)=>{
//     console.log(err);
// })
// const db=mongoose.connection;
// console.log(db.name);
if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'));
    const path=require('path');
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}
const server=app.listen(proceess.env.PORT||3001,()=>{
    console.log("Server running at port 3001");
})

const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

io.on("connection",(socket)=>{
    console.log(socket.id);
    console.log(socket.rooms);
    socket.on("join_room",(data)=>{
        socket.join(data.room)
        console.log(data.username+"joined the room"+data.room);
       socket.to(data.room).emit("user_joined",data.username);
       console.log(io.sockets.adapter.rooms.get(data.room).size);
       //socket.to(data.room).emit("room_clients",io.sockets.adapter.rooms.get(data.room).size);
        
    })
    socket.on("send_message",(data)=>{
         console.log(data);
        socket.to(data.room).emit("receive_message",data.content);
    })
    socket.on('disconnect',()=>{
        console.log("user disconnected");
    })
})
app.post('/room_clients',(req,res)=>{
    const room=req.body.room;
    console.log(req.body)
    console.log(room);
    if(room==="")
    {
        res.json({clients:0})
    }
    else{
        if(io.sockets.adapter.rooms.get(room)===undefined){
            res.json({clients:"yet to join!!wait"})
        }
        else{
    res.json({clients:io.sockets.adapter.rooms.get(room).size})
        }
    }
})
