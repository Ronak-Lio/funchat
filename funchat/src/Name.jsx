import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import Avatar from "@mui/material/Avatar";
import { UserContext } from "./App";
import { useHistory } from "react-router-dom";

function Name({ chat }) {
  const [chatUser, setChatUser] = useState();
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    if (chat?.userId && state) {
      fetch(`/chatDetails/${chat.userId}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // console.log(data?.result);
          setChatUser(data?.result);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [state, chat?.userId]);

  return (
    <>
      {chat?.type === "SingleUser" ? (
        <Container
          onClick={() =>
            history.push(`/chat/${chat?.collectionName}/${chatUser?.name}`)
          }
        >
          <Avatar className="name_avatar" src={chatUser?.pic} />
          <p>{chatUser?.name}</p>
        </Container>
      ) : (
        <Container
          onClick={() => history.push(`/chat/${chat?.collectionName}`)}
        >
          <Avatar className="name_avatar" />
          <p>{chat?.collectionName}</p>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  display: flex;
  padding: 10px;
  border-bottom: 1px solid lightgray;

  &:hover {
    cursor: pointer;
    background-color: #ebebeb;
  }

  p {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 20px;
  }

  .name_avatar {
  }
`;

export default Name;
