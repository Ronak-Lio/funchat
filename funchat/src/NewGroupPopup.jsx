import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "./App";
import Name from "./Name";
import Avatar from "@mui/material/Avatar";

function NewGroupPopup() {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [participants, setParticipants] = useState([]);
  const[input, setInput] = useState();
  const[x,setX] = useState(0);
  const[names , setNames] = useState([]);

  useEffect(() => {
    fetch("/allusers", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result?.users);
      });
  }, []);

  useEffect(() => {
    fetch("/allCollectionNames", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Names are " , result);
        setNames(result);
      });
  } , [state]);

  const addParticipant = (user) => {
    if (!participants.includes(user?._id)) {
      participants.push(user?._id);
      console.log("Pushed");
      setX(x+1);
      
    } else {
      const index = participants.findIndex(
        (participant) => participant === user?._id
      );
      participants.splice(index, 1);
      console.log("Removeddd");
      setX(x+1);
      
    }
  };


  const createGroup = (e) => {
     e.preventDefault();
     console.log("CCreated Group");

     const index = names.findIndex((name) => name?.name === input) || -1;

     console.log("Index is ", index);
     
     if(index === -1 && input && !input.includes(' ')){
      fetch("/createGroup", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          participants : participants,
          groupName: input,
        }),
      })
      .then((res) => res.json())
      .then(result => {
           console.log("Result is " , result);
          localStorage.setItem("user" , JSON.stringify(result));
          dispatch({
            type: "UPDATE",
            payload: { chats : result.chats},
          });
          
          dispatch({ type: "OPEN_GROUP_POPUP", payload: false });
        })
        .catch((err) => {
          console.log(err);
        });
     }else{
       alert("Please choose another name")
     }
     
     
  }

  return (
    <Container>
      <div className="post_Popup">
        <div className="popup_header">
          <CloseIcon
            className="close_icon"
            onClick={() => {
              dispatch({ type: "OPEN_GROUP_POPUP", payload: false });
            }}
          />
        </div>
        <div className="group_details">
          <input type="text" placeholder="Enter Group Name" 
           value = {input}
           onChange = {(e) => setInput(e.target.value)}
          />
          <p>Select Participants</p>
          <p style = {{
              display : "none"
          }}>{x}</p>
          <div style = {{
                  display : "flex",
              }}>
          {participants?.length > 0 &&
            participants.map((participant) => (
              <>
                {data
                  .filter((user) => {
                    return user?._id.includes(participant);
                  })
                  .map((user) => (
                    <p>{user.name}{' '},</p>
                  ))}
              </>
            ))}
            </div>
        </div>
        <div className="all_users">
          {data.map((user) => (
            <div className="user" onClick={() => addParticipant(user)}>
              <Avatar src={user.pic} />
              <div className="user_details">
                <p>{user?.name}</p>
                <p>{user?.email}</p>
              </div>
            </div>
          ))}
        </div>
        <button
         className = 'btn waves-effect waves-light #64b5f6 blue darken-1'
         onClick = {createGroup}
        >Create Group</button>
      </div>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  color: black;
  background-color: #858484cc;
  display: flex;
  justify-content: center;
  animation: fadeIn 0.7s;
  align-items: center;

  .post_Popup {
    background-color: #fff;
    width: 400px;
    height: fit-content;
    margin: auto;
    border-radius: 7px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.24);
    padding: 10px;

    @media (max-width: 500px) {
      width: 85vw;
    }
  }

  .popup_header {
    display: flex;
    justify-content: flex-end;
  }

  .close_icon {
    margin-right: 5px;
    &:hover {
      color: #6d6969;
      cursor: pointer;
    }
  }

  .post_options {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }

  .regular_post {
    border: 1px solid lightgray;
    background-color: #d3d3d3;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;

    img {
      margin-right: 10px;
    }

    &:hover {
      background-color: #6e6e6e;
      color: white;
      cursor: pointer;
    }
  }

  .user {
    display: flex;
    border-bottom: 1px solid lightgray;
    padding: 10px 0 10px 0;

    &:hover {
      cursor: pointer;
      background-color: #ebebeb;
    }
  }

  .user_details {
    margin-left: 10px;
    p {
      margin-top: 0;
      margin-bottom: 5px;
    }
  }

  .group_details {
    input {
      border-radius: 10px;
      border: 1px solid gray;
      padding-left: 10px;
      outline: 0;
      width: 90%;
    }
  }
`;

export default NewGroupPopup;
