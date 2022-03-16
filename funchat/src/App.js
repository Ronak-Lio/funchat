import React , {useState , useEffect , createContext , useReducer , useContext} from 'react'
import './App.css';
import Chat from './Chat';
import Login from './Login';
import Navbar from './Navbar';
import { BrowserRouter, Route , useHistory  } from "react-router-dom";
import Signup from './SignUp';
import {initialState, reducer} from "./reducers/userReducer"

export const UserContext = createContext()




const Routing = () => {
  const history = useHistory();
  const{state , dispatch} = useContext(UserContext);

  useEffect(() => {
     const user = JSON.parse(localStorage.getItem("user"));
     console.log(user);
     
     if(user){
       dispatch({type : 'USER' , payload : user});
       history.push('/chat');
     }else{
       history.push('/login')
     }
  } , [])


  useEffect(() => {
    console.log("State is " , state)
  } , [state])

  return(
    <>
       <Route exact path="/chat">
        <Chat/>
      </Route>
      <Route exact path="/chat/:collectionName/:chatUser">
        <Chat/>
      </Route>
      <Route exact path="/chat/:collectionName">
        <Chat/>
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup/>
      </Route>
      <Route exact path="/">
         <Login />
      </Route>
      </>
  )
}


function App() {
  const[state , dispatch] = useReducer(reducer , initialState);
  const[user , setUser] = useState();


  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  } , [])

  return (
    <UserContext.Provider value = {{state , dispatch}}>
    <BrowserRouter>
      {!user && <Navbar/>}
      <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
