import React from "react";
import logo from "../../asserts/logo.png";
import "./header.styles.scss";

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="header">
      <div className="header-actions">
        <button
          className="toggle-sidebar-btn"
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? "✕" : "☰"}
        </button>
        <img className="logo" src={logo} alt="LOGO" />
      </div>

        <div className="title">
            <h2>LINGO MATE</h2>
        </div>


      <div className="header-actions">
        <button className="login-btn">Login</button>
      </div>
    </header>
  );
};

export default Header;
