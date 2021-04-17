import { useEffect, useState } from "react";
import {ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import Button from '@material-ui/core/Button';

import SendIcon from '@material-ui/icons/Send';
//import { makeStyles } from '@material-ui/core/styles';
import io from 'socket.io-client';
import 'bootstrap/dist/css/bootstrap.css';
import SentimentVerySatisfiedIcon from '@material-ui/icons/SentimentVerySatisfied';
import axios from 'axios';
import './Main.css';
let socket;
const CONNECTION_URL="https://namastechat.herokuapp.com/";

const Main=()=>{
    // const classes = useStyles()
    
  
    const [loggedIn,setLoggedIn]=useState(false);
    const [roomClients,setroomClients]=useState();
    const [room,setRoom]=useState("");
    const [user,setUser]=useState("");
    //after login
    const [message,setMessage]=useState("");
    const [messageList,setMessageList]=useState([]);  
   
    useEffect(()=>{
        socket=io(CONNECTION_URL);
        socket.on("receive_message",(data)=>{
            
           
            setMessageList([...messageList,data]);
           
            var chatWindow = document.getElementById('chat-window'); 
            var xH = chatWindow.scrollHeight; 
            chatWindow.scrollTo(0, xH);
        })
        socket.on("user_joined",async(data)=>{
           
            toast(data+"  joined the room");
           
           
        })
     axios.post(CONNECTION_URL+"room_clients",{room}).then((response)=>{
            setroomClients(response.data.clients);
        })

      
        // socket.on("room_clients",(data)=>{
        //     console.log(data);
        //     setroomClients(data);
        // })
    },[])
    const connectToRoom=()=>{
        
        var roomObject={
            room:room,username:user
        }
        socket.emit("join_room",roomObject);
        setLoggedIn(true);
      
        

    }
    const sendMessage=async ()=>{
        let messageContent={
            room:room,
            content:{
            author:user,
            message:message
            }
        }
        await socket.emit("send_message",messageContent);
        setMessageList([...messageList,messageContent.content]);
        var chatWindow = document.getElementById('chat-window'); 
var xH = chatWindow.scrollHeight; 
chatWindow.scrollTo(0, xH);
        setMessage("");
    }
    return (
        <div className="container-fluid bg-light text-dark">
              <ToastContainer />    
            <div className="row text-center borders">
                    <h1 className="text-primary">NamasteChat</h1>
            </div>
            <div className="row mt-3">
            <div className="col-md-3 text-dark borders">
            <SentimentVerySatisfiedIcon style={{color:"black",fontSize:"2rem"}}></SentimentVerySatisfiedIcon>
            <br></br>
            <div className="set">User:{user}</div>
            <div className="set">Room:{room}</div>
            {loggedIn===true?(<h1 className="set">participants:{roomClients}</h1>):("")}
            </div>
            {!loggedIn?
            (
                   <div className="login col-md-9">
                       <div className="inputs">
                        <input type="text" placeholder="name.." onChange={(e)=>{setUser(e.target.value)}}/>
                        <input type="text" placeholder="Room..." onChange={(e)=>{setRoom(e.target.value)}}/>
                        </div>
                        <div>
                        <button onClick={connectToRoom}>Connect Room</button>
                        </div>
                    </div>
            ):(
            
               <div className="chatContainer col-md-9">
                    <div className="messages" id="chat-window">
                        
                        {
                        messageList.map((value,key)=>{
                                return (
                                    <div className={value.author===user?"messageContainer you":"messageContainer other"}>
                                <div className="messageIndividual">
                                {value.author}:{value.message}
                                </div>
                                
                                </div>
                                )
                        })
                    }
                       
                   
                    </div>
                    <div className="messageInputs">
                    <input type="text" placeholder="message.." value={message} onChange={(e)=>{
                        
                        setMessage(e.target.value)
                        }} onKeyPress={event => {
                            if (event.key === 'Enter') {
                              sendMessage();
                            }
                          }}/> 
                    <button onClick={sendMessage}><SendIcon/></button>   
                    </div>
                </div>
            )}
            </div>
            
            
        </div>
    )
}
export default Main;    