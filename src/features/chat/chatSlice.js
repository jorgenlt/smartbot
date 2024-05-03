import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import fetchOpenAiChatCompletion from "../../api/openAiApi";
import fetchAnthropicChatCompletion from "../../api/anthropicApi";
import uuid from "react-native-uuid";

const initialState = {
  conversations: {},
  currentId: null,
  status: "idle",
  providers: {
    current: { provider: "openAi", model: "gpt-3.5-turbo" },
    openAi: {
      key: null,
      model: "gpt-3.5-turbo",
      models: ["gpt-3.5-turbo", "gpt-4-turbo"],
    },
    anthropic: {
      key: null,
      model: "claude-3-sonnet-20240229",
      models: [
        "claude-3-haiku-20240307",
        "claude-3-sonnet-20240229",
        "claude-3-opus-20240229",
      ],
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
      const response =
        provider === "openAi"
          ? await fetchOpenAiChatCompletion(context, message, providers)
          : await fetchAnthropicChatCompletion(context, message, providers);

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
      state.providers.current.provider = provider;
      state.providers.current.model = state.providers[provider].model;
    },
    resetProviders: (state) => {
      state.providers = initialState.providers;
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
} = chat.actions;

export default chat.reducer;
