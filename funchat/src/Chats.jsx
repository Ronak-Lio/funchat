import React , {useState ,useEffect , useContext} from 'react'
import styled from "styled-components"
import { UserContext } from './App';
import Name from './Name';
import Pusher from 'pusher-js';

function Chats() {
  const {state , dispatch} = useContext(UserContext );
  const[chats , setChats] = useState([]);

  useEffect(() => {
     setChats(state?.chats)
} , [state]);


useEffect(() => {
      if(state?.email){
        const pusher = new Pusher('8dc14cf4580bd19ab156', {
          cluster: 'ap2',
        });
    
        const channel = pusher.subscribe(state?.email);
        channel.bind('updated', (newChat) =>{
          console.log(newChat)
          setChats([...chats,newChat?.newChat])
        });
    
        return () => {
        channel.unbind_all();
        channel.unsubscribe();
      }; 
      }
  } , [chats, state]);

  useEffect(() => {
    dispatch({
      type: "UPDATE",
      payload: { chats :  chats},
    });
  }, [chats?.length])

  


  return (
    <Container>
        <p className = 'chats_title'>Chats</p>
        <p className = 'add_chat' onClick = {() => dispatch({type : 'OPEN_SEARCH_POPUP' , payload : true})}>Add New Chat</p>
        <p className = 'add_chat' onClick = {() => dispatch({type : 'OPEN_GROUP_POPUP' , payload : true})}>Add New Group</p>
        {chats?.map((chat) => (
          <Name chat = {chat}/>
        ))}
    </Container>
  )
};

const Container = styled.div`
  display : flex;
  flex-direction : column;
  overflow-y : scroll;

  ::-webkit-scrollbar{
      display : none;
  }

 .chats_title{
    margin-left : 20px;
    font-size : 20px;
    margin-top : 10px;
    margin-bottom : 10px;
 }

 .add_chat{
   border-top : 1px solid lightgray;
   border-bottom : 1px solid lightgray;
   margin-top :0;
   margin-bottom : 0;
   padding : 10px 0 10px 20px;

   &:hover {
     cursor: pointer;
     background-color : #ebebeb;
 }
 }
`;

export default Chats