import React, { useState, useEffect } from 'react';
import Header from './components/header/header.component';
import Sidebar from './components/sidebar/sidebar.component';
import Footer from './components/footer/footer.component';
import MainComponent from './components/mainComponent/mainComponent.component';
import './App.styles.scss';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isStarted, setIsStarted] = useState(false); // State for Start/Stop button
  const [conversation, setConversation] = useState([]); // Track conversation
  const [topic, setTopic] = useState(''); // Selected topic from Sidebar

  // Resizing window size if it is less that 768

  // useEffect(() => {
  //   // Check screen width on initial load
  //   if (window.innerWidth <= 768) {
  //     setIsSidebarOpen(false); // Close sidebar on mobile by default
  //   }
  // }, []); // Empty dependency array ensures this runs only once on mount

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStartStopToggle = async () => {
    setIsStarted(!isStarted);

    if (!isStarted) {
      // Start recording
      console.log('Recording started...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          console.log('Recording stopped, processing audio...');
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

          // Send audioBlob to the backend
          const formData = new FormData();
          formData.append('audio', audioBlob);

          try {
            const response = await fetch(
              'http://localhost:5000/api/speech-to-text',
              {
                method: 'POST',
                body: formData,
              }
            );

            if (response.ok) {
              const result = await response.json();
              const userText = result.text;

              // Add user input to the conversation
              setConversation((prev) => [
                ...prev,
                { sender: 'user', text: userText },
              ]);

              // Get AI response from backend
              const chatResponse = await fetch(
                'http://localhost:5000/api/chat',
                {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ text: userText }),
                }
              );

              if (chatResponse.ok) {
                const chatResult = await chatResponse.json();
                setConversation((prev) => [
                  ...prev,
                  { sender: 'ai', text: chatResult.response },
                ]);
              } else {
                console.error('Failed to fetch AI response');
              }
            } else {
              console.error('Failed to process audio');
            }
          } catch (error) {
            console.error('Error communicating with backend:', error);
          }
        };

        mediaRecorder.start();

        // Stop the recording after a certain time or user interaction
        setTimeout(() => mediaRecorder.stop(), 5000); // Example: stop after 5 seconds
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else {
      console.log('Recording stopped manually.');
      // Logic to stop recording if needed (e.g., with a global reference to mediaRecorder)
    }
  };

  const handleTopicSelect = (selectedTopic) => {
    setTopic(selectedTopic);
    setConversation([
      { sender: 'ai', text: `Let's talk about ${selectedTopic}.` },
    ]);
  };

  return (
    <div className='app'>
      <Header toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className='main-content'>
        {isSidebarOpen && (
          <div className='sidebar-container'>
            <Sidebar onTopicSelect={handleTopicSelect} />
          </div>
        )}
        <section className='content-area'>
          <MainComponent conversation={conversation} />
          <Footer
            handleStartStopToggle={handleStartStopToggle}
            isStarted={isStarted}
          />
        </section>
      </div>
    </div>
  );
}

export default App;

