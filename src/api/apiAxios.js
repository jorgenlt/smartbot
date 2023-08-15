import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const url = 'https://api.openai.com/v1/chat/completions';

async function fetchAxiosChatCompletion(context, prompt) {
  try {
    
    console.log('context message:', [
      ...context, 
      { 
        role: 'user', 
        content: prompt 
      }
    ]);
    
    const requestBody = {
      model: 'gpt-3.5-turbo',
      messages: [
        ...context, 
        { 
          role: 'user', 
          content: prompt 
        }
      ]
    };
    
    const response = await axios.post(url, requestBody, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
    });

    console.log('response from api:', response.data);
    
    return {
      role: response.data.choices[0].message.role,
      content: response.data.choices[0].message.content,
    }
    
  } catch (error) {
    console.error('Error in fetchChatCompletion:', error.message || error.response.data.error?.message);
    throw error;
  }
}

export default fetchAxiosChatCompletion;
