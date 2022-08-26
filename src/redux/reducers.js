import {
  NOTIFICATION_PUSH,
  NOTIFICATION_POP,
  CURRENT_USER_SET,
  LOADER_SET,
  APP_STATE_SET,
  ROUTE_INDEX_SET,
  NEWS_SET,
  SELECTED_DEPARTMENT_SET,
  SELECTED_ROOM_SET,
  NEW_MESSAGE_SEND_SET,
} from "./actions";

export const toast = (state = [], action) => {
  switch (action.type) {
    case NOTIFICATION_PUSH:
      return [...state, action.text];

    case NOTIFICATION_POP:
      return state.length > 0 ? state.slice(1) : state;

    default:
      return state;
  }
};

export const currentUser = (state = null, action) => {
  switch (action.type) {
    case CURRENT_USER_SET:
      return action.user;

    default:
      return state;
  }
};

export const loader = (state = false, action) => {
  switch (action.type) {
    case LOADER_SET:
      return action.state;

    default:
      return state;
  }
};

export const selectedRoom = (state = {}, action) => {
  switch (action.type) {
    case SELECTED_ROOM_SET:
      return action.text;
    default:
      return state;
  }
};

export const newMessageSend = (state = false, action) => {
  switch (action.type) {
    case NEW_MESSAGE_SEND_SET:
      return action.text;
    default:
      return state;
  }
};
