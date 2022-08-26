import React, { useEffect } from "react";

import { Provider } from "react-redux";
import store, { persistor } from "../redux/store";
import { PersistGate } from "redux-persist/es/integration/react";
import Navigaion from "./Navigaion";
import Global from "../components/Global";
import notifee from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
// import initializeApp from "firebase-admin/app";
// function onMessageReceived(message) {
//   notifee.displayNotification(JSON.parse(message.data.notifee));
// }

// messaging().onMessage(onMessageReceived);
// messaging().setBackgroundMessageHandler(onMessageReceived);
messaging().setBackgroundMessageHandler(async (message) => {
  console.log("message background", message);
  await onMessageReceived(message);
});
const onMessageReceived = (message) => {
  const { type, body, title } = message.data;
  console.log(`onMessageReceived`, message);
  if (type === "incoming_call") {
    notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId: "default",
      },
    });
  } else {
    notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId: "default",
      },
    });
  }
};
const App = () => {
  useEffect(async () => {
    // initializeApp();
    await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });
    await messaging().onMessage(onMessageReceived);
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        {/* <Global /> */}
        <Navigaion />
      </PersistGate>
    </Provider>
  );
};
export default App;
