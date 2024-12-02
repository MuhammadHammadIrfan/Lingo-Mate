const axios = require('axios');

const speechToText = async (audioBase64) => {
  const response = await axios.post(
    `https://${process.env.AZURE_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US`,
    Buffer.from(audioBase64, 'base64'), // Convert Base64 to binary
    {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
        'Content-Type': 'audio/wav',
      },
    }
  );

  return response.data.DisplayText;
};

const textToSpeech = async (text) => {
  const ssml = `<speak version='1.0' xml:lang='en-US'>
    <voice name='en-US-JennyNeural'>${text}</voice>
  </speak>`;

  const response = await axios.post(
    `https://${process.env.AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`,
    ssml,
    {
      headers: {
        'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
        'Content-Type': 'application/ssml+xml',
      },
      responseType: 'arraybuffer', // Expect audio in binary format
    }
  );

  return Buffer.from(response.data, 'binary').toString('base64'); // Return Base64-encoded audio
};

module.exports = { speechToText, textToSpeech };
