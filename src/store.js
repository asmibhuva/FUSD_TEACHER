import { rootReducer } from "./__redux/rootReducer";
import { configureStore } from '@reduxjs/toolkit'
import { composeWithDevTools } from 'redux-devtools-extension';
import { getDefaultMiddleware } from '@reduxjs/toolkit';

const customizedMiddleware = getDefaultMiddleware({
  serializableCheck: false
})

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => customizedMiddleware,
},
  composeWithDevTools()
);
export default store