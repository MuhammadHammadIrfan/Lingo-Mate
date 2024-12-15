import React, { useEffect, useRef } from "react";
import "./mainComponent.styles.scss";

const MainComponent = ({ conversation }) => {
  const conversationEndRef = useRef(null);

//   Automatically scroll to the bottom of the conversation when it updates
//   useEffect(() => {
//     if (conversationEndRef.current) {
//       conversationEndRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   }, [conversation]);

  return (
    <div className="main-component">
      <h2>Conversation</h2>
      <div className="conversation-container">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === "user" ? "user-message" : "ai-message"}`}
          >
            <p>{message.text}</p>
          </div>
        ))}
        <div ref={conversationEndRef} />
      </div>
    </div>
  );
};

export default MainComponent;
