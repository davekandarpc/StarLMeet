export const NOTIFICATION_PUSH = "notification/PUSH";
export const NOTIFICATION_POP = "notification/POP";
export const CURRENT_USER_SET = "currentUser/SET";
export const LOADER_SET = "loader/SET";
export const APP_STATE_SET = "appState/SET";
export const ROUTE_INDEX_SET = "routeIndex/SET";
export const SELECTED_DEPARTMENT_SET = "selectedDepartment/SET";
export const NEWS_SET = "news/SET";
export const SELECTED_ROOM_SET = "selectedRoom/SET";
export const NEW_MESSAGE_SEND_SET = "newMessageSend/SET";
// action creators

export const notificationPush = (text) => ({
  type: NOTIFICATION_PUSH,
  text,
});

export const notificationPop = () => ({
  type: NOTIFICATION_POP,
});

export const currentUserSet = (user) => ({
  type: CURRENT_USER_SET,
  user,
});

export const loaderSet = (state) => ({
  type: LOADER_SET,
  state,
});

export const selectedRoomSet = (text) => ({
  type: SELECTED_ROOM_SET,
  text,
});
