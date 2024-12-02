const express = require('express');
const azureUtils = require('../utils/azureUtils');
const router = express.Router();

// Speech-to-Text (STT)
router.post('/stt', async (req, res) => {
  try {
    const { audio } = req.body; // Base64 audio input
    if (!audio) {
      return res.status(400).send('Audio data is required.');
    }
    const text = await azureUtils.speechToText(audio);
    res.json({ text });
  } catch (error) {
    console.error('Error with Azure STT:', error.message);
    res.status(500).send('Error in speech-to-text conversion.');
  }
});

// Text-to-Speech (TTS)
router.post('/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).send('Text input is required.');
    }
    const audio = await azureUtils.textToSpeech(text);
    res.json({ audio }); // Base64 audio output
  } catch (error) {
    console.error('Error with Azure TTS:', error.message);
    res.status(500).send('Error in text-to-speech conversion.');
  }
});

module.exports = router;
