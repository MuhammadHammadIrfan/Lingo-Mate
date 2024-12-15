const express = require('express');
const sdk = require('microsoft-cognitiveservices-speech-sdk');
const router = express.Router();
require('dotenv').config();

// Speech-to-Text (STT) endpoint
router.post('/stt', async (req, res) => {
  try {
    const base64Audio = req.body.audio;
    if (!base64Audio) {
      return res.status(400).send('Audio input is required.');
    }

    const audioBuffer = Buffer.from(base64Audio, 'base64');

    // Configure Azure Speech SDK
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY,
      process.env.AZURE_REGION
    );

    const audioConfig = sdk.AudioConfig.fromWavFileInput(audioBuffer);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    // Recognize the speech
    recognizer.recognizeOnceAsync(
      (result) => {
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          res.json({ text: result.text });
          console.log('Recognized Text in STT:', result.text);
        } else {
          console.error('Speech recognition failed:', result.errorDetails);
          res.status(500).send('Error in speech-to-text conversion.');
        }
        recognizer.close();
      },
      (error) => {
        console.error('Error with Azure STT:', error);
        res.status(500).send('Error in speech-to-text conversion.');
        recognizer.close();
      }
    );
  } catch (error) {
    console.error('Error with Azure STT:', error.message);
    res.status(500).send('Error in speech-to-text conversion.');
  }
});

// Text-to-Speech (TTS) endpoint
router.post('/tts', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).send('Text input is required.');
  }

  try {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY,
      process.env.AZURE_REGION
    );
    speechConfig.speechSynthesisOutputFormat =
      sdk.SpeechSynthesisOutputFormat.Audio16Khz32KBitRateMonoMp3;

    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const audioBase64 = Buffer.from(result.audioData).toString('base64');
          res.json({ audio: audioBase64 });
        } else {
          console.error('Speech synthesis failed:', result.errorDetails);
          res.status(500).send('Error synthesizing speech.');
        }
        synthesizer.close();
      },
      (error) => {
        console.error('Error synthesizing speech:', error);
        res.status(500).send('Error synthesizing speech.');
        synthesizer.close();
      }
    );
  } catch (error) {
    console.error('Error with Azure TTS:', error.message);
    res.status(500).send('Error in text-to-speech conversion.');
  }
});

module.exports = router;

