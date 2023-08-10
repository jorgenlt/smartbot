import { configureStore } from '@reduxjs/toolkit'
import chatReducer from '../features/chat/chatSlice'

export const store = configureStore({
  reducer: {
    chat: chatReducer
  }
})