// const express = require('express');
// const axios = require('axios');
// const router = express.Router();
// require('dotenv').config();

// router.post('/', async (req, res) => {
//   const { userMessage, conversation } = req.body;

//   try {
//     const systemMessage = {
//       role: 'system',
//       content:
//         'Please keep your responses short and conversational, and feel free to ask questions when appropriate, just like a friendly chat.',
//     };

//     const messages = [
//       systemMessage,
//       ...conversation,
//       { role: 'user', content: userMessage },
//     ];
//     const apiKey =
//       process.env.OPENAI_API_KEY;

//     // Log the payload correctly
//     console.log('Headers:', {
//       Authorization: `Bearer ${apiKey}`,
//     });
//     console.log('Payload:', {
//       model: 'gpt-3.5-turbo',
//       messages: messages, // Correct variable to log here
//     });

//     const response = await axios.post(
//       'https://api.openai.com/v1/chat/completions',
//       {
//         model: 'gpt-3.5-turbo',
//         messages: messages,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//         },
//       }
//     );

//     const aiResponse = response.data.choices[0].message.content;
//     res.json({ aiResponse });
//   } catch (error) {
//     console.error('Error with OpenAI API:', error.message);
//     res.status(500).send('Error communicating with OpenAI API.');
//   }
// });

// module.exports = router;

//Gemini Implementation
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

router.post('/', async (req, res) => {
  const { userMessage, conversation } = req.body;


  try {
    const genAI = new GoogleGenerativeAI(process.env.Gemini_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemMessage = {
      role: 'system',
      content:
      // 'Always keep your responce concise and conversational, behave like a client I got from a freelancing platform and going to do your project on selected topic. Even though you are not a human, behave like you are a human talking to a freelancer who is going to do your project and you are taking his interview to decide whether you are going to assign him your project or he is not good enough. Also after some conversation when you can decide whether am I compatable for your project or not, you have to tell me that whether you are going to hire me or your are going to reject me.',
        'Always keep you responce short and conversational, behave like a friendly chat. Do not generate respose like an LLM. Conversate with me just like two frinends do with each other. Tell about your things and ask about me also about that specific topic. You ofcourse as an LLM do not have experience or feeling like a human but behave like you are a human talking to his friend.',
    };

    // Combine system message, conversation history, and user message into the prompt
    const prompt = `${systemMessage.content}\n${conversation
      .map((msg) =>
        msg.sender === 'user' ? `User: ${msg.content}` : `AI: ${msg.content}`
      )
      .join('\n')}\nUser: ${userMessage}`;

    console.log('Generated Prompt:', prompt);

    // Define the async function to get the response from the model
    const response = async (prompt) => {
      try {
        const result = await model.generateContent(prompt);
        console.log('Complete result:', result); // Log the entire result to see its structure

        if (
          result &&
          result.response &&
          typeof result.response.text === 'function'
        ) {
          // Call the function to get the text content
          const aiResponse = result.response.text(); // This should give you the actual text response
          console.log(aiResponse); // Log the response content
          return aiResponse; // Return the AI's response
        } else {
          console.log('No valid response found in the result');
          return 'Error: Unable to retrieve AI response'; // Return a default error message
        }
      } catch (error) {
        console.log('Error:', error.message);
        return 'Error occurred while processing your request'; // Return a generic error message
      }
    };

    const aiResponse = await response(prompt);

    // Send the AI response back to the client
    res.json({ aiResponse });
  } catch (error) {
    console.error('Error with Gemini API:', error.message);
    res.status(500).send('Error communicating with Gemini API.');
  }
});


module.exports = router;
