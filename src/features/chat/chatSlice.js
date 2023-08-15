import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import fetchAxiosChatCompletion from '../../api/apiAxios';
import uuid from 'react-native-uuid'

const initialState = {
  conversations: {},
  currentId: null,
  status: 'idle',
  error: null
}

export const getChatResponseThunk = createAsyncThunk(
  'chat/getResponse',
  async (message, { getState }) => {
    const state = getState();

    const id = state.chat.currentId;

    if (id) {
      const context = state.chat.conversations[id].messages;    
      const prompt = message;
  
      console.log('context from thunk:', context);
      console.log('prompt from thunk:', prompt);
      console.log('conversations from thunk:', state.chat.conversations);
  
      try {
        const response = await fetchAxiosChatCompletion(context, prompt);
        return response;
      } catch (error) {
        return Promise.reject(error.message);
      };
    };
  }
);

export const chat = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addConversation: state => {
      const id = uuid.v4();
      state.currentId = id;
      state.conversations[id] = {
        created: Date.now(),
        messages: []
      };

      console.log('new conversation added with id', id);
      console.log('redux state:', state);
    },
    updateMessages: (state, action) => {
      const id = state.currentId;
      if (id) {
        console.log('id from updateMessages:', id);
        state.conversations[id]?.messages.push(action.payload);
      }
    },
    deleteConversation: (state, action) => {
      const id = action.payload;
      
      delete state.conversations[id];

      console.log(`message with id: ${id} was deleted.`);

      state.currentId = null;

      console.log('state.currentId = null');
    },
    deleteConversations: state => {
      state.conversations = {};
      state.currentId = null;
      console.log('Messages deleted.');
    },
    updateCurrentId: (state, action) => {
      state.currentId = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getChatResponseThunk.pending, state => {
        state.status = 'loading';
        console.log('getChatResponseThunk loading...');
      })
      .addCase(getChatResponseThunk.fulfilled, (state, action) => {
        // state.status = 'succeeded';
        state.error = null;
        state.status = 'idle';

        console.log('getChatResponseThunk succeeded...');

        const id = state.currentId;
        const content = action.payload.content;
        const role = action.payload.role;

        if (id && content && role) {
          const message = {
            content: action.payload.content,
            role: action.payload.role
          };
  
          state.conversations[id]?.messages.push(message);
        }

      })
      .addCase(getChatResponseThunk.rejected, (state, action) => {
        state.status = 'failed';
        console.log('getChatResponseThunk failed...');
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
  updateCurrentId
} = chat.actions

export default chat.reducer;