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
    current: { name: "OpenAI", provider: "openAi", model: "gpt-4o-mini" },
    openAi: {
      name: "OpenAI",
      key: null,
      model: "gpt-4o-mini",
      models: ["gpt-4o-mini", "gpt-4o"],
    },
    anthropic: {
      name: "Anthropic",
      key: null,
      model: "claude-3-5-sonnet-20241022",
      models: [
        "claude-3-5-haiku-20241022",
        "claude-3-5-sonnet-20241022",
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
  theme: "light",
  largeText: false,
};

// Get chat completion from chosen provider using async thunk
export const getChatResponseThunk = createAsyncThunk(
  "chat/getResponse",
  async (prompt, { getState }) => {
    const {
      chat: { currentId, conversations, providers },
    } = getState();

    // Exit early if currentId is falsy
    if (!currentId) {
      return;
    }

    // Remove key/value "created" from obj. API doesn't support additional input
    const context = conversations[currentId].messages.map((message) => {
      const { created, ...rest } = message;
      return rest;
    });

    const provider = providers.current.provider;

    try {
      let response;

      switch (provider) {
        case "openAi":
          response = await fetchOpenAiChatCompletion(
            context,
            prompt,
            providers
          );
          break;
        case "anthropic":
          response = await fetchAnthropicChatCompletion(
            context,
            prompt,
            providers
          );
          break;
        case "mistral":
          response = await fetchMistralChatCompletion(
            context,
            prompt,
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
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    toggleLargeText: (state) => {
      state.largeText = !state.largeText;
    },
    addConversation: (state) => {
      const id = uuid.v4();

      state.currentId = id;
      state.conversations[id] = {
        created: Date.now(),
        messages: [
          {
            created: Date.now(),
            content: "Hello! How can I assist you today?",
            role: "assistant",
          },
        ],
      };
    },
    updateMessages: (state, action) => {
      const { currentId } = state;
      const message = {
        ...action.payload,
        created: Date.now(),
      };

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
    importConversations: (state, action) => {
      const { importedConversations } = action.payload;

      state.conversations = importedConversations;
      state.currentId = null;
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
            created: Date.now(),
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
  toggleTheme,
  toggleLargeText,
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
  importConversations,
} = chat.actions;

export default chat.reducer;
