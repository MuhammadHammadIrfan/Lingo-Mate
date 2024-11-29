import React, { useState, useEffect } from 'react';
import Header from './components/header/header.component';
import Sidebar from './components/sidebar/sidebar.component';
import Footer from './components/footer/footer.component';
import './App.styles.scss';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isStarted, setIsStarted] = useState(false); // State for Start/Stop button

  useEffect(() => {
    // Check screen width on initial load
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false); // Close sidebar on mobile by default
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStartStopToggle = () => {
    setIsStarted(!isStarted); // Toggle between Start and Stop
  };

  return (
    <div className='app'>
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className='main-content'>
        {isSidebarOpen && (
          <div className='sidebar-container'>
            <Sidebar />
          </div>
        )}
        <main className='content-area'>
          <h1>Welcome to the App</h1>
          <p>This is where your main content will be displayed.</p>

          <Footer
            handleStartStopToggle={handleStartStopToggle}
            isStarted={isStarted}
          />
        </main>
      </div>
    </div>
  );
}

export default App;
