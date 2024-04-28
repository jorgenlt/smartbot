import axios from "axios";

const url = "https://api.openai.com/v1/chat/completions";
const model = "gpt-3.5-turbo";
// const model = 'gpt-4';

// Fetch chat completion with the axios library.
async function fetchChatCompletion(context, prompt, keys) {
  const API_KEY = keys.openAi;

  const userMessage = {
    role: "user",
    content: prompt,
  };

  const requestBody = {
    model: model,
    messages: [...context, userMessage],
  };

  const config = {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(url, requestBody, config);

    const role = response.data.choices[0].message.role;
    const content = response.data.choices[0].message.content;

    return {
      role,
      content,
    };
  } catch (error) {
    console.error(
      "Error in fetchChatCompletion:",
      error.message || error.response.data.error?.message
    );
    throw error;
  }
}

export default fetchChatCompletion;
