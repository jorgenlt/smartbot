import axios from "axios";

// OpenAI
// Fetch chat completion with the axios library.
async function fetchOpenAiChatCompletion(context, prompt, providers) {
  const URL = "https://api.openai.com/v1/chat/completions";
  const API_KEY = providers.openAi.key;
  const MODEL = providers.openAi.model;

  const userMessage = {
    role: "user",
    content: prompt,
  };

  const requestBody = {
    model: MODEL,
    messages: [...context, userMessage],
  };

  const config = {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await axios.post(URL, requestBody, config);

    const { role, content } = response.data.choices[0].message;

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

export default fetchOpenAiChatCompletion;
