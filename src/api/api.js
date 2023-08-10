// api.js

const API_KEY = process.env.EXPO_PUBLIC_API_KEY; 

async function fetchChatCompletion(context, prompt) {
  // Construct request
  const requestBody = {
    model: 'gpt-4',
    messages: [
      ...context, 
      { 
        role: 'user', 
        content: prompt 
      }
    ],
    max_tokens: 6000
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
  const response = await fetch('https://api.openai.com/v1/chat/completions', requestOptions);

  // Handle response
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error.message);
  }

  const responseMessage = data.choices[0].message;

  return {
    messages: requestBody.messages,
    role: responseMessage.role,
    content: responseMessage.content,
  }
}

export default fetchChatCompletion;