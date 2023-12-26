import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./redux/index";

const store = configureStore({
  reducer: rootReducer,
});

export default store;
