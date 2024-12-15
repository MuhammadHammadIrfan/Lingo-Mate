const axios = require('axios');

async function testAPI() {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Hello!' }],
      },
      {
        headers: {
          Authorization: `Bearer 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`,
        },
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error('API Test Error:', error.response?.data || error.message);
  }
}

testAPI();
