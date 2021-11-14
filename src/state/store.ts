import { configureStore } from '@reduxjs/toolkit';
import itemsReducer from './itemsSlice';
import boxesReducer from './boxesSlice';

const persistedData = localStorage.getItem('state');

export const store = configureStore({
  preloadedState: persistedData ? JSON.parse(persistedData) : {},
  reducer: {
    item: itemsReducer,
    box: boxesReducer,
  },
});

store.subscribe(() => {
  localStorage.setItem('state', JSON.stringify(store.getState()));
});

export type RootState = ReturnType<typeof store.getState>;
