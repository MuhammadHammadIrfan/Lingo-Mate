// import './footer.styles.scss';
// import info from '../../asserts/info.jpg';

// const Footer = ({ handleStartStopToggle, isStarted }) => {
//   return (
//     <div className="footer">
//       <button className="start-stop-btn" onClick={handleStartStopToggle}>
//         {isStarted ? 'Stop' : 'Start'}
//       </button>
//       <div className="info-container">
//         <img className="info-img" src={info} alt="INFO" />
//         <div className="info-tooltip">
//           <p>Lingo Mate helps you improve your English fluency through conversation with AI</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Footer;









import './footer.styles.scss';
import info from '../../asserts/info.jpg';
import { useState } from 'react';
import axios from 'axios';

const Footer = ({ handleStartStopToggle, isStarted, setConversation }) => {
  const [audioData, setAudioData] = useState(null);

  const handleStopRecording = async () => {
    if (audioData) {
      try {
        // Send audio data to backend for speech-to-text
        const sttResponse = await axios.post('/api/speech/stt', { audio: audioData });
        const userMessage = sttResponse.data.text;

        // Add user message to the conversation
        setConversation((prev) => [
          ...prev,
          { sender: 'user', text: userMessage },
        ]);

        // Send text to backend for AI response and text-to-speech
        const chatResponse = await axios.post('/api/chat', { userMessage });
        const aiResponse = chatResponse.data.aiResponse;

        // Add AI response to the conversation
        setConversation((prev) => [
          ...prev,
          { sender: 'ai', text: aiResponse },
        ]);

        // Convert AI text to speech
        const ttsResponse = await axios.post('/api/speech/tts', { text: aiResponse });
        const audio = ttsResponse.data.audio;
        
        // Play the AI's response as audio
        const audioElement = new Audio(`data:audio/wav;base64,${audio}`);
        audioElement.play();
      } catch (error) {
        console.error("Error with API:", error);
      }
    }
  };

  return (
    <div className="footer">
      <button className="start-stop-btn" onClick={() => {
        handleStartStopToggle(); 
        if (isStarted) {
          handleStopRecording();
        }
      }}>
        {isStarted ? 'Stop' : 'Start'}
      </button>
      <div className="info-container">
        <img className="info-img" src={info} alt="INFO" />
        <div className="info-tooltip">
          <p>Lingo Mate helps you improve your English fluency through conversation with AI</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
