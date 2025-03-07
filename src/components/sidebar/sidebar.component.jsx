import React, { useState } from "react";
import "./sidebar.styles.scss";

const Sidebar = () => {
  const [topic, setTopic] = useState("");
  const handleTopicChange = (e) => {
    setTopic(e.target.value); 
  };

  const confirmInput = () => {
    if (topic.trim() !== "") {
      console.log("Topic selected:", topic);
    } else {
      console.log("Please enter a valid topic.");
    }
  };

  return (
    <div className="side-bar">
      <div className="sidebar-content">
        <div className="lang-and-topic-selector">
          <select value="english" disabled>
            <option value="english">English</option>
          </select>
          <input
            type="text"
            id="topic"
            placeholder="Enter a topic"
            value={topic}
            onChange={handleTopicChange}
          />
          <button className="side-bar-btn" id="side-bar-btn" onClick={confirmInput}>Confirm</button>
        </div>

        <div className="history" id="history">
          <h2>History</h2>
          Nothing to Show
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

