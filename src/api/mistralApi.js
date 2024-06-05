import MistralClient from "@mistralai/mistralai";

const fetchMistralChatCompletion = async (context, prompt, providers) => {
  const { key: API_KEY, model: MODEL } = providers.mistral;

  const userMessage = {
    role: "user",
    content: prompt,
  };

  const messages = [...context, userMessage];

  const client = new MistralClient(API_KEY);

  try {
    const chatResponse = await client.chat({
      model: MODEL,
      messages: messages,
    });

    const { content, role } = chatResponse.choices[0].message;

    return {
      role,
      content,
    };
  } catch (error) {
    console.error(
      "Error in fetchMistralChatCompletion:",
      error.message || error.response.data.error?.message
    );
    throw error;
  }
};

export default fetchMistralChatCompletion;
