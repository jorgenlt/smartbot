// api.js

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;
const url = 'https://api.openai.com/v1/chat/completions';

async function fetchChatCompletion(context, prompt) {
  // Check if context is valid
  if (!context) {
    context = [];
  };

  // Construct request
  const requestBody = {
    model: 'gpt-3.5-turbo',
    messages: [
      ...context, 
      { 
        role: 'user', 
        content: prompt 
      }
    ],
    max_tokens: 2000
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  };

  // Make API call    
  const response = await fetch(url, requestOptions);

  if (!response.ok) {
    throw new Error(data.error.message);
  }
  
  // Handle response
  const data = await response.json();

  const responseMessage = data.choices[0].message;

  return {
    messages: requestBody.messages,
    role: responseMessage.role,
    content: responseMessage.content,
  }
}

export default fetchChatCompletion;