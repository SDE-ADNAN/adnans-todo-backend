// store.ts
import { configureStore } from '@reduxjs/toolkit';
import UISliceReducer from './UISlice';
import UserSliceReducer from './UserSlice';
// import slice2Reducer from './slice2';
// import slice3Reducer from './slice3';

const store = configureStore({
  reducer: {
    UI: UISliceReducer,
    User: UserSliceReducer,
    // slice3: slice3Reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
