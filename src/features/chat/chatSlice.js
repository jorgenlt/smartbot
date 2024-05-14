import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchOpenAiChatCompletion from "../../api/openAiApi";
import fetchAnthropicChatCompletion from "../../api/anthropicApi";
import fetchMistralChatCompletion from "../../api/mistralApi";
import uuid from "react-native-uuid";

const initialState = {
  conversations: {},
  currentId: null,
  status: "idle",
  providers: {
    current: { name: "OpenAI", provider: "openAi", model: "gpt-3.5-turbo" },
    openAi: {
      name: "OpenAI",
      key: null,
      model: "gpt-3.5-turbo",
      models: ["gpt-3.5-turbo", "gpt-4o"],
    },
    anthropic: {
      name: "Anthropic",
      key: null,
      model: "claude-3-sonnet-20240229",
      models: [
        "claude-3-haiku-20240307",
        "claude-3-sonnet-20240229",
        "claude-3-opus-20240229",
      ],
    },
    mistral: {
      name: "Mistral",
      key: null,
      model: "mistral-small-latest",
      models: ["mistral-small-latest", "mistral-large-latest"],
    },
  },
  error: null,
};

// Get chat completion from ChatGPT (OpenAI) using async thunk
export const getChatResponseThunk = createAsyncThunk(
  "chat/getResponse",
  async (message, { getState }) => {
    const {
      chat: { currentId, conversations, providers },
    } = getState();

    if (!currentId) {
      return; // Exit early if currentId is falsy
    }

    const context = conversations[currentId].messages;
    const provider = providers.current.provider;

    try {
      let response;

      switch (provider) {
        case "openAi":
          response = await fetchOpenAiChatCompletion(
            context,
            message,
            providers
          );
          break;
        case "anthropic":
          response = await fetchAnthropicChatCompletion(
            context,
            message,
            providers
          );
          break;
        case "mistral":
          response = await fetchMistralChatCompletion(
            context,
            message,
            providers
          );
          break;
        default:
          throw new Error("Unsupported chat completion provider: " + provider);
      }

      return response;
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

// Chat slice of the Redux store
export const chat = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addConversation: (state) => {
      const id = uuid.v4();

      state.currentId = id;
      state.conversations[id] = {
        created: Date.now(),
        messages: [
          { content: "Hello! How can I assist you today?", role: "assistant" },
        ],
      };
    },
    updateMessages: (state, action) => {
      const { currentId } = state;
      const message = action.payload;

      if (currentId) {
        state.conversations[currentId]?.messages.push(message);
      }
    },
    deleteConversation: (state, action) => {
      const id = action.payload;

      delete state.conversations[id];

      state.currentId = null;
    },
    deleteConversations: (state) => {
      state.conversations = {};
      state.keys = {};
      state.currentId = null;
    },
    deleteKey: (state, action) => {
      const { provider } = action.payload;
      state.providers[provider].key = null;
    },
    updateCurrentId: (state, action) => {
      state.currentId = action.payload;
    },
    addKey: (state, action) => {
      const { provider, apiKey } = action.payload;
      state.providers[provider].key = apiKey;
    },
    setProvider: (state, action) => {
      const { provider } = action.payload;
      state.providers.current.name = state.providers[provider].name;
      state.providers.current.provider = provider;
      state.providers.current.model = state.providers[provider].model;
    },
    resetProviders: (state) => {
      // Preserve the current keys
      const openAiKey = state.providers.openAi.key;
      const anthropicKey = state.providers.anthropic.key;
      const mistralKey = state.providers.mistral.key;

      // Reset providers to initial state
      state.providers = {
        ...initialState.providers,
        openAi: {
          ...initialState.providers.openAi,
          key: openAiKey,
        },
        anthropic: {
          ...initialState.providers.anthropic,
          key: anthropicKey,
        },
        mistral: {
          ...initialState.providers.mistral,
          key: mistralKey,
        },
      };
    },
    setModel: (state, action) => {
      const { provider, model } = action.payload;

      const currentProvider = state.providers.current.provider;

      if (provider === currentProvider) {
        state.providers.current.model = model;
        state.providers[provider].model = model;
      } else {
        state.providers[provider].model = model;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Case when fetching chat response is pending
      .addCase(getChatResponseThunk.pending, (state) => {
        state.status = "loading";
      })
      // Case where getting chat response is successful (fulfilled)
      .addCase(getChatResponseThunk.fulfilled, (state, action) => {
        state.error = null;
        state.status = "idle";

        const { currentId } = state;
        const { content, role } = action.payload;

        if (currentId && content && role) {
          const message = {
            content,
            role,
          };

          // Push the fetched message into the messages of current conversation
          state.conversations[currentId]?.messages.push(message);
        }
      })
      // Case where getting chat response failed
      .addCase(getChatResponseThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// Action creators are generated for each case reducer function
export const {
  updateMessages,
  deleteConversation,
  deleteConversations,
  addConversation,
  updateCurrentId,
  addKey,
  deleteKey,
  setProvider,
  resetProviders,
  setModel,
} = chat.actions;

export default chat.reducer;
