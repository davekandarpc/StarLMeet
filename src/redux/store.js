import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import {
  toast,
  currentUser,
  loader,
  selectedRoom,
  newMessageSend,
} from "./reducers";

import { persistStore, persistCombineReducers } from "redux-persist";
import createSensitiveStorage from "redux-persist-sensitive-storage";
const storage = createSensitiveStorage({
  keychainService: "myKeychain",
  sharedPreferencesName: "mySharedPrefs",
});

const config = {
  key: "root",
  storage,
};

const reducer = persistCombineReducers(config, {
  toast,
  currentUser,
  loader,
  selectedRoom,
  newMessageSend,
});
let store = createStore(reducer);

let persistor = persistStore(store);
export { persistor };
export default store;
