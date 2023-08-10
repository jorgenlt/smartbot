import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import fetchChatCompletion from '../../api/api';
import { useSelector } from 'react-redux';

const initialState = {
  test: ['testing redux'],
  messages: [],
  userMessage: '',
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
      throw error; // Rethrow the error to trigger the rejected case
      console.log('error from thunk');
    }
  }
);

export const chat = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    updateMessages: (state, action) => {
      state.messages = [
        ...state.messages,
        action.payload
      ]
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

        console.log('getChatResponseThunk succeeded...');

        // update state
        state.messages = [
          ...state.messages,
          {
            content: action.payload.content,
            role: action.payload.role
          }
        ];

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
export const { updateMessages } = chat.actions

export default chat.reducer;