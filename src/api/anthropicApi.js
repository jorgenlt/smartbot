import Anthropic from "@anthropic-ai/sdk";

async function fetchAnthropicChatCompletion(context, prompt, providers) {
  const API_KEY = providers.anthropic.key;
  const MODEL = providers.anthropic.model;

  const userMessage = {
    role: "user",
    content: prompt,
  };

  const messages = [...context, userMessage].slice(1); // Anthropic API messages must start with a message with the role "user", remove the first item in the array

  console.log("🚀 ~ fetchAnthropicChatCompletion ~ messages:", messages);

  const anthropic = new Anthropic({
    apiKey: API_KEY,
  });

  try {
    const msg = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1024,
      messages: messages,
    });

    const role = msg.role;

    const content = msg.content[0].text;

    return {
      role,
      content,
    };
  } catch (error) {
    console.error(
      "Error in fetchAnthropicChatCompletion:",
      error.message || error.response.data.error?.message
    );
    throw error;
  }
}

export default fetchAnthropicChatCompletion;
