# SmartBot - Chat with assistants from OpenAI, Anthropic and Mistral
## A native Android app created with React Native on the Expo framework.

## Building and Running the App
Follow the steps below to build and run the SmartBot app (requires Android Studio SDK):

1. Install the app dependencies by running `npm install`.
2. Test the app using `npx expo start`.
3. Build the .apk file by running `eas build -p android --profile preview`.
4. Scan QR code with your phone to download the app
5. Go to Settings to enter your API key of the providers you wish to use.

</br>

<div>
  <img className="smartbot-mobile" src="https://github.com/jorgenlt/smartbot/assets/108831121/bc8e0a64-74c3-42ee-8b6b-c98481c1d2ed" alt="Smartbot screenshot" width="300px" />
  <img className="smartbot-mobile" src="https://github.com/jorgenlt/smartbot/assets/108831121/06d921df-317b-45b7-aae9-ddac6738b11b" alt="Smartbot screenshot" width="300px" />
</div>
<div>
  <img className="smartbot-mobile" src="https://github.com/jorgenlt/smartbot/assets/108831121/babe6088-a9a4-4c87-aac9-eadb8fd723a1" alt="Smartbot screenshot" width="300px" />
  <img className="smartbot-mobile" src="https://github.com/jorgenlt/smartbot/assets/108831121/1c154398-c493-4701-907e-e9543650be3f" alt="Smartbot screenshot" width="300px" />
</div>

<h2>Features</h2>
<ul>
  <li>Chat with assistants from OpenAi, Anthropic and Mistral</li>
  <li>Switch between providers and models</li>
  <li>Create, browse and delete conversations</li>
  <li>Continue an earlier conversation</li>
  <li>Copy a message to clipboard</li>
  <li>Share a message</li>
</ul>

<h2>Technologies</h2>
<p>
  Smartbot is a native mobile app for Android that was built using <a href="https://reactnative.dev/" target="_blank">React Native</a> and 
  the <a href="https://expo.dev/" target="_blank">Expo framework</a>. The app connects to 
  the <a href="https://platform.openai.com/docs/introduction" target="_blank">OpenAI API</a> to utilize its artificial intelligence 
  capabilities. To manage state and actions across the app, it uses <a href="https://redux-toolkit.js.org/" target="_blank">Redux Toolkit</a>. When 
  the app needs to get data asynchronously from the API, it uses the <a href="https://redux.js.org/usage/writing-logic-thunks" target="_blank">Redux Thunk</a> middleware. 
  The app also utilizes the <a href="https://axios-http.com/" target="_blank">Axios</a> library for API requests, 
  the <a href="https://date-fns.org/" target="_blank">Date-fns</a> library for working with dates and times, 
  and <a href="https://github.com/rt2zz/redux-persist#readme" target="_blank">Redux Persist</a> to persist some Redux state.
</p>

<h2>
  Project structure
</h2>
      
```.bash
├── App.js
└── src
    ├── api
    │   └── api.js
    ├── app
    │   └── store.js
    ├── common
    │   └── utils
    │       ├── capitalizeFirstWord.js
    │       └── findObject.js
    ├── components
    │   └── Settings.js
    ├── features
    │   └── chat
    │       ├── ChatInput.js
    │       ├── Chat.js
    │       ├── chatSlice.js
    │       ├── Conversations.js
    │       ├── Messages.js
    │       └── NewChat.js
    └── styles
        └── colors.js
```
      
<h2>Technical challenges</h2>

<h3>The Redux slice</h3>
<p>
  Redux state management and actions.
</p>

```.javascript
// src/features/chat/chatSlice.js

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
```
  
<h3>API call</h3>
<p>
  Chat completions API call.
</p>

```.javascript
// src/api/anthropicApi.js

import Anthropic from "@anthropic-ai/sdk";

async function fetchAnthropicChatCompletion(context, prompt, providers) {
  const { key: API_KEY, model: MODEL } = providers.anthropic;

  const userMessage = {
    role: "user",
    content: prompt,
  };

  const messages = [...context, userMessage].slice(1); // Anthropic API messages must start with a message with the role "user", remove the first item in the array

  const anthropic = new Anthropic({
    apiKey: API_KEY,
  });

  try {
    const msg = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 3500,
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
```

<h3>Displaying messages</h3>
<p>
  Displaying messages in a conversation. 
</p>

```.javascript
// src/features/chat/Messages.js

import { useRef, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  Pressable,
  Share,
  Alert
} from 'react-native'
import { Audio } from 'expo-av';
import * as Clipboard from 'expo-clipboard'
import { format } from 'date-fns'
import uuid from 'react-native-uuid'
import { colors, chat, base } from '../../styles/colors'
import { Flow } from 'react-native-animated-spinkit'

const Messages = () => {
  const [typingSound, setTypingSound] = useState();

  const { currentId, conversations, error, status } = useSelector(state => state.chat);
  const messages = conversations[currentId]?.messages;
  const date = conversations[currentId]?.created;

  let formatedDate;

  if (date) {
    formatedDate = format(date, 'LLLL d, y');
  }
  
  // Function to copy text(messages) to clipboard.
  const handleCopyToClipboard = async text => {
    await Clipboard.setStringAsync(text);
    Alert.alert('', 'Copied to Clipboard.')
  };

  // Share message
  const handleShare = async message => {
    try {
      const result = await Share.share({
        message:
          message,
      });
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  
  // Creating the message elements to render in the ScrollView.
  let messageElements;

  if (messages) {
    messageElements = messages.map(message => {
      return (
        <View 
        style={message.role === 'assistant' ? styles.messageWrapperAssistant : styles.messageWrapperUser} 
        key={uuid.v4()} 
        >
          <Pressable 
            style={message.role === 'assistant' ? styles.messageAssistant : styles.messageUser}
            onLongPress={() => handleShare(message.content)}
            onPress={() => handleCopyToClipboard(message.content)}
          >
            <Text>
              {message.content}
            </Text>
          </Pressable>
        </View>
      )
    });
  }
  
  // Ref for ScrollView
  const scrollRef = useRef();

  // Sound effects
  // Load sound when component mounts
  useEffect(() => {
    async function loadTypingSound() {
      const { sound } = await Audio.Sound.createAsync(require('../../../assets/typing.mp3'));
      setTypingSound(sound);
    }

    loadTypingSound();

     // Cleanup
     return typingSound ? () => {
      typingSound.unloadAsync(); 
    } : undefined;
  }, []);

  // Function to play sound
  const playTypingSound = async () => {
    if (typingSound) {
      await typingSound.replayAsync();
    }
  };

  // Play typing sound when status is 'loading'
  useEffect(() => {
    if (status === 'loading') {
      playTypingSound();
    } else if (typingSound && status === 'idle') {
      // Stop typing sound
      typingSound.stopAsync();
    }
  }, [status])

  return (
    <>
      <ScrollView 
        contentContainerStyle={styles.messagesWrapper}
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: false })}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.date}>
          <Text style={styles.dateText}>{formatedDate}</Text>
        </View>

        {messageElements}

        {
          status === 'loading' && 
          <View style={styles.messageWrapperAssistant}>
            <View style={styles.flowLoader}>
              <Flow size={30} color='#202020'  />
            </View>
          </View>
        }
      </ScrollView>
      {error && <Text>{error}</Text>}
    </>
  )
}

export default Messages

const styles = StyleSheet.create({
  messagesWrapper: {
    paddingHorizontal: 5,
    paddingBottom: 20,
    width: '100%'
  },
  messageWrapperUser: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginVertical: 10,
    width: '100%'
  },
  messageWrapperAssistant: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
  },
  messageUser: {
    backgroundColor: chat.messageUserBg,
    color: colors.text,
    borderRadius: 20,
    borderTopRightRadius: 2,
    padding: 10,
    maxWidth: '90%',
  },
  messageAssistant: {
    backgroundColor: chat.messageAssistantBg,
    color: colors.text,
    borderRadius: 20,
    borderTopLeftRadius: 2,
    padding: 10,
    maxWidth: '90%'
  },
  noMessagesWrapper: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noMessages: {
    fontSize: 18
  },
  flowLoader: {
    padding: 15,
    alignItems: 'center',
    backgroundColor: chat.messageAssistantBg,
    color: base.loader,
    borderRadius: 20,
    borderTopLeftRadius: 2,
  },
  date: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10
  },
  dateText: {
    color: colors.gray,
  }
})
```

<h2>Upcoming features</h2>
<ul>
  <li>Dark mode</li>
  <li><s>Enter API key in app</s> ✅</li>
  <li><s>Switch between models</s> ✅</li>
  <li><s>Add Antropic as provider</s> ✅</li>
  <li><s>Add Mistral as provider</s> ✅</li>
</ul>
