import { configureStore } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from 'redux-persist/lib/storage'
import chatReducer from '../features/chat/chatSlice'

// Configuration object for redux-persist.
// Only objects on the whitelist are stored.
const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['messages', 'status', 'error', 'conversations', 'nextConversationId', 'currentId']
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, chatReducer);

export const store = configureStore({
  reducer: {
    chat: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      // serializableCheck: {
      //   // Ignore these action types
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, 'dataReader/updateFilterDate'],
      // },
    }),
});

// The Redux persistor for persisting store state.
export const persistor = persistStore(store);
