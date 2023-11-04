import { configureStore } from '@reduxjs/toolkit';
import { widgetSlice } from './slice.ts';

export const store = configureStore({
  reducer: {
    widget: widgetSlice.reducer
  }
});

// Типизация для RootState и AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
