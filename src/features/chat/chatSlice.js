import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import fetchChatCompletion from '../../api/api';
import uuid from 'react-native-uuid'

const initialState = {
  conversations: {},
  nextConversationId: 1,
  currentId: null,
  loading: false,
  status: 'idle',
  error: null
}

export const getChatResponseThunk = createAsyncThunk(
  'chat/getResponse',
  async (message, { getState }) => {
    const context = getState().chat.messages;
    const prompt = message;

    console.log('context:', context);
    console.log('prompt:', prompt);

    try {
      const response = await fetchChatCompletion(context, prompt);
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const chat = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addConversation: state => {
      const id = state.nextConversationId;
      state.currentId = id;
      state.conversations[id] = [];
      state.nextConversationId++;

      console.log('new conversation added with id', id);
      console.log('redux state:', state);
    },
    updateMessages: (state, action) => {
      const id = state.currentId.toString();
      state.conversations[id].push(action.payload);
    },
    deleteMessages: state => {
      console.log('Messages deleted. State set to inital state:', state);
      return initialState;
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
        state.status = 'succeeded';
        state.error = null;
        console.log('getChatResponseThunk succeeded...');

        const id = state.currentId.toString();
        const message = {
          content: action.payload.content,
          role: action.payload.role
        };

        state.conversations[id].push(message);

        // Set status back to idle.
        console.log('setting status to idle...');
        state.status = 'idle';

        console.log('redux state:', state);
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
  deleteMessages,
  addConversation,
  updateCurrentId
} = chat.actions

export default chat.reducer;