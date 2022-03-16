import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import styled from "styled-components";
import CloseIcon from "@mui/icons-material/Close";
import { UserContext } from "./App";
import Name from "./Name";
import Avatar from "@mui/material/Avatar";

function SearchPopup() {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);

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

  const addChat = (user) => {
    console.log("User is " , user);
    for(let i = 0 ; i<state?.chats?.length ; i++){
      if(state?.chats[i]?.userId === user._id){
         alert("Already in your chat")
         dispatch({ type: "OPEN_SEARCH_POPUP", payload: false });
         return;
      }
      else if(i === state?.chats?.length - 1){
        fetch("/addChat", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
          body: JSON.stringify({
            userId: user._id,
            collectionName: "messages" + state.name + user.name,
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
            
            dispatch({ type: "OPEN_SEARCH_POPUP", payload: false });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

    if(state?.chats?.length === 0){
      fetch("/addChat", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          userId: user._id,
          collectionName: "messages" + state.name + user.name,
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
          
          dispatch({ type: "OPEN_SEARCH_POPUP", payload: false });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Container>
      <div className="post_Popup">
        <div className="popup_header">
          <CloseIcon
            className="close_icon"
            onClick={() => {
              dispatch({ type: "OPEN_SEARCH_POPUP", payload: false });
            }}
          />
        </div>
        <div className="all_users">
          {data.map((user) => (
            <div className="user" onClick={() => addChat(user)}>
              <Avatar src={user.pic} />
              <div className="user_details">
                <p>{user?.name}</p>
                <p>{user?.email}</p>
              </div>
            </div>
          ))}
        </div>
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
`;

export default SearchPopup;
