import React , {useState , useEffect , useContext} from 'react'
import {useHistory , Link} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from "./App"
import axios from './axios';


function Login() {
  const[email , setEmail] = useState();
  const[password , setPassword] = useState();
  const history = useHistory();
  const {state , dispatch} = useContext(UserContext);

  const PostData = () => {

    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
      return M.toast({html : "invalid email" , classes : '#c62828 red darken-3'})
    }
      fetch("/signin" , {
        method: 'POST',
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({
          email,
          password
        })
      }).then(res => 
          res.json()
        )
      .then((data) => {
        console.log(data);
        if(data.error) {
          M.toast({html : data.error , classes : '#c62828 red darken-3'})
        }else{
          localStorage.setItem("jwt" , data.token);
          localStorage.setItem("user" , JSON.stringify(data.user))
          dispatch({type : 'USER' , payload : data.user})
          M.toast({html : "signedin success" , classes : '#43a047 green darken-1'})
          history.push('/chat')
        }
      }).catch((err) => {
        console.log(err);
      })
  }

  return (
    <div className = 'mycard'>
      <div className="card auth-card input-field">
          <h3>FunChat</h3> 
          <input type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)}/>
        <input type="password" placeholder="password" onChange={(e) => setPassword(e.target.value)}/>
          <button className = 'btn waves-effect waves-light #64b5f6 blue lighten-2'
           onClick={PostData}
          >Login</button>
          <h5>
          <Link to = "/signup">Don't have an account?</Link>
        </h5>
      </div>
    </div>
  )
}

export default Login