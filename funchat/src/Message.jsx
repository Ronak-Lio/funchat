import React from "react";
import styled from "styled-components";

function Message({message}) {
  return (
    <Container>
      <div className="message">
        <p className="message_name">{message?.name}</p>
        <div className="message_message">
          <p>
            {message?.message}
          </p>
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  margin-bottom: 20px;
  margin-right: 10px;
  margin-left: auto;
  max-width: 50%;
  display : flex;
  justify-content : flex-end;
 

  .message_message {
    background-color: #fff;
    width: fit-content;
    padding: 10px;
    border-radius: 10px;
    p {
      margin-top: 0;
      margin-bottom: 0;
    }

    img {
      width: 100%;
      object-fit: contain;
      max-width: 100%;
      border-radius: 10px;
    }

    .caption {
      margin-left: 10px;
    }
  }

  .message_name {
    margin-bottom: 0px;
    font-size: x-small;
    margin-left: 5px;
    margin-bottom: 3px;
    width: fit-content;
    color : white;
  }
`;

export default Message;
