import React, { useState, useEffect , useContext } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import Chats from "./Chats";
import SendIcon from "@mui/icons-material/Send";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import Message from "./Message";
import { UserContext } from "./App";
import SearchPopup from "./SearchPopup";
import {useHistory , useParams} from 'react-router-dom'
import Pusher from 'pusher-js';
import NewGroupPopup from "./NewGroupPopup";

function Chat() {
  const [input, setInput] = useState();
  const{state , dispatch} = useContext(UserContext);
  const {collectionName , chatUser} = useParams();
  const[messages, setMessages] = useState([]);
  const history = useHistory();

  useEffect(() => {
     if(collectionName && state){
      const pusher = new Pusher('8dc14cf4580bd19ab156', {
            cluster: 'ap2',
          });
      
          const channel = pusher.subscribe(collectionName);
          channel.bind('inserted', (newMessage) =>{
            console.log(newMessage)
            setMessages([...messages,newMessage])
          });
      
          return () => {
          channel.unbind_all();
          channel.unsubscribe();
        }; 
     }
  } , [collectionName , messages , state])

  useEffect(() => {
     if(collectionName && state){
        fetch(`/getMessages/${collectionName}` , {
            headers : {
              "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then((res) => res.json())
        .then((result) => {
          console.log(result);
          setMessages(result.messages);
        });
     } 
  } , [collectionName , state]);

  const sendMessage = (e) => {
    e.preventDefault();

    fetch('/sendMessage' , {
      method : 'POST',
      headers: {
        "Content-Type": "application/json",
         "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        collectionName,
        messageInfo : input
      }),
    })
    .then((res) => res.json())
    .then((data) => {
        if(data){
           console.log(data);
           setInput();
        }
      })
      .catch((err) => {
        console.log(err);
      });

  }

  const logOut = (e) => {
    e.preventDefault();
    localStorage.clear();
   dispatch({type : "CLEAR"})
    history.push('/login')
  }

  return (
    <Container>
      <div className="all_chats">
        <div className="all_chats_header">
          <Avatar className="profile_avatar" onClick = {logOut}/>
          <p className="user_name">{state?.name}</p>
        </div>
        <Chats />
      </div>
      <div className="chat_body">
      {(chatUser || collectionName) && (<>
       <div className="chat_body_header">
          <Avatar className="chatName_avatar" />
          <p>{chatUser ? chatUser : collectionName}</p>
        </div>
        <div className="chat_messages">
            {messages?.length > 0 && messages.map((message) => (
              <Message message={message}/>
            ))}
        </div>
        <div className="chat_section_footer">
          <div className="message_input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
           <SendIcon className="send_icon" onClick = {sendMessage} /> 
        </div>
        </>)}
        {!chatUser && !collectionName && (
          <div
           style  = {{
             display : 'flex',
             justifyContent : 'center',
             alignItems : 'center',
             height : '100%'
           }}
           >
             <p>Please click on any Chat to select or add new chat</p>
          </div>
        )}
      </div>
      {/* <div className="chat_suggestions">
         <p className = 'suggestions_title'>Suggestions</p>
      </div> */}
      {state?.openSearchPopup && <SearchPopup/>}
      {state?.openGroupPopup && <NewGroupPopup/>}
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;

  .all_chats {
    display: flex;
    flex-direction: column;
    border-right: 1px solid lightgray;
    flex: 0.25;
  }

  .all_chats_header {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid lightgray;
  }

  .profile_avatar {
    margin-right: 20px;
    width: 60px;
    height: 60px;
  }

  .user_name {
    margin-top: auto;
    margin-bottom: auto;
    font-size: 20px;
  }

  .chat_body {
    display: flex;
    flex-direction: column;
    flex: 0.75;
    border-right: 1px solid lightgray;
  }

  .chat_body_header {
    display: flex;
    padding: 10px;
    border-bottom: 1px solid lightgray;

    p {
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }

  .chatName_avatar {
    margin-right: 10px;
  }

  .chat_section_footer {
    padding: 10px;
    display: flex;

    .message_input {
      border: 1px solid lightgray;
      width: 95%;
      border-radius: 20px;
      display: flex;
      padding: 3px;
    }

    input {
      outline: 0;
      border: 0;
      height: inherit;
      margin-left: 5px;
      padding: 0;
      font-size: 18px;
      width: 100%;
      padding-right: 10px;
    }

    .emoji_icon {
      font-size: 25px;
      color: #686868;

      &:hover {
        cursor: pointer;
        color: gray;
      }
    }
  }

  .send_icon {
    margin-left: 10px;
    margin-top: auto;
    margin-bottom: auto;
    color: #686868;

    &:hover {
      cursor: pointer;
      color: gray;
    }
  }

  .attach_icon {
    margin-top: auto;
    margin-bottom: auto;
    margin-right: 1px;
    color: #686868;

    &:hover {
      cursor: pointer;
      color: gray;
    }
  }

  .chat_suggestions{
      display : flex;
      flex-direction : column;
      flex : 0.25;
  }

  .suggestions_title{
      margin-top : 0;
      margin-bottom : 0;
      padding : 10px;
      border-bottom : 1px solid lightgray;
      font-size : 17px;
  }

  .chat_messages{
      flex : 1;
      border-bottom  : 1px solid lightgray;
     display: flex;
    flex-direction: column-reverse;
    overflow-y: scroll;
    background-image: url("https://i.pinimg.com/736x/2a/68/b4/2a68b4d59d9b4b25c32a3cb4738c6cdc.jpg");
    background-position: center;
    background-size : 20%;
    background-repeat: repeat;
     
    ::-webkit-scrollbar {
        display : none;
    }
  }

  .profile_avatar{
    &:hover {
      cursor : pointer;
    }
  }


`;

export default Chat;
