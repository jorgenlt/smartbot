import axios from 'axios';

// Setting up api key, base url and model info
const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const url = 'https://api.openai.com/v1/chat/completions';
const model = 'gpt-4';

// Fetch chat completion with the axios library.
async function fetchChatCompletion(context, prompt) {

  const userMessage = {
    role: 'user',
    content: prompt
  };

  const requestBody = {
    model: model,
    messages: [
      ...context, 
      userMessage
    ]
  };

  const config = {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await axios.post(url, requestBody, config);

    const role = response.data.choices[0].message.role;
    const content = response.data.choices[0].message.content;

    return {
      role,
      content
    }
    
  } catch (error) {
    console.error('Error in fetchChatCompletion:', error.message || error.response.data.error?.message);
    throw error;
  }
}

export default fetchChatCompletion;
