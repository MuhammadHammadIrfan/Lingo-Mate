import React, { useState, useEffect } from 'react';
import AudioBufferToWav from 'audiobuffer-to-wav';
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


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleStartStopToggle = async () => {
    setIsStarted(!isStarted);

    if (!isStarted) {
      console.log('Recording started...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const audioContext = new AudioContext(); // Create an AudioContext for processing
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'audio/webm',
        });

        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          console.log('Recording stopped, processing audio...');

          // Combine audio chunks into a Blob
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

          // Convert Blob to AudioBuffer
          const arrayBuffer = await audioBlob.arrayBuffer();
          const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

          // Convert AudioBuffer to WAV
          const wavData = AudioBufferToWav(audioBuffer);
          const wavBlob = new Blob([wavData], { type: 'audio/wav' });

          // Convert WAV Blob to base64
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Audio = reader.result.split(',')[1]; // Get base64 part of the result

            // Send audio to speech-to-text API
            try {
              const sttResponse = await fetch(
                'http://localhost:5000/api/speech/stt',
                {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ audio: base64Audio }),
                }
              );

              if (sttResponse.ok) {
                const { text: userText } = await sttResponse.json();

                // Add user input to the conversation
                setConversation((prev) => [
                  ...prev,
                  { sender: 'user', text: userText },
                ]);

                // Fetch AI response
                try {
                  const chatResponse = await fetch(
                    'http://localhost:5000/api/chat',
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        userMessage: userText,
                        conversation: conversation.map((msg) => ({
                          role: msg.sender === 'user' ? 'user' : 'assistant',
                          content: msg.text,
                        })),
                      }),
                    }
                  );

                  if (chatResponse.ok) {
                    const { aiResponse } = await chatResponse.json();

                    // Add AI response to the conversation
                    setConversation((prev) => [
                      ...prev,
                      { sender: 'ai', text: aiResponse },
                    ]);

                    // Play AI response via TTS
                    playAudio(aiResponse);
                  } else {
                    console.error(
                      'Error fetching AI response:',
                      chatResponse.statusText
                    );
                  }
                } catch (error) {
                  console.error('Error with chat API:', error.message);
                }
              } else {
                console.error(
                  'Error in speech-to-text response:',
                  sttResponse.statusText
                );
              }
            } catch (error) {
              console.error('Error sending audio to the server:', error.message);
            }
          };

          reader.readAsDataURL(wavBlob);
        };

        // Start the recording
        mediaRecorder.start();

        // Save the recorder so it can be stopped manually
        window.mediaRecorder = mediaRecorder; // Save for manual control
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else {
      console.log('Recording stopped manually.');
      if (window.mediaRecorder) {
        window.mediaRecorder.stop(); // Stop the recording when the stop button is pressed
        window.mediaRecorder = null;
      }
    }
  };



  const playAudio = async (text) => {
    try {
      const response = await fetch('http://localhost:5000/api/speech/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const { audio } = await response.json();
        const audioBlob = new Blob(
          [
            new Uint8Array(
              atob(audio)
                .split('')
                .map((char) => char.charCodeAt(0))
            ),
          ],
          {
            type: 'audio/wav',
          }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        const audioPlayer = new Audio(audioUrl);
        audioPlayer.play();
      } else {
        console.error(
          'Error in text-to-speech response:',
          response.statusText
        );
      }
    } catch (error) {
      console.error('Error with TTS API:', error.message);
    }
  };

  const handleTopicSelect = (selectedTopic) => {
    const aiMessage = `Okay so you selected ${selectedTopic} for conversation, lets talk about it.`;
    setTopic(selectedTopic);
    setConversation([
      { sender: 'ai', text: aiMessage },
    ]);

    playAudio(aiMessage);
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

