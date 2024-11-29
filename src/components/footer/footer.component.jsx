import './footer.styles.scss';
import info from '../../asserts/info.jpg';

const Footer = ({ handleStartStopToggle, isStarted }) => {
  return (
    <div className="footer">
      <button className="start-stop-btn" onClick={handleStartStopToggle}>
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
