import React, { useEffect } from "react";

import { Provider } from "react-redux";
import store, { persistor } from "../redux/store";
import { PersistGate } from "redux-persist/es/integration/react";
import Navigaion from "./Navigaion";
import Global from "../components/Global";
import notifee, {
  EventType,
  AndroidLaunchActivityFlag,
  AuthorizationStatus,
} from "@notifee/react-native";
import { Voximplant } from "react-native-voximplant";
import messaging from "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";
import * as RootNavigation from "../utils/RootNavigation";

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
      pressAction: {
        id: "mark-as-read",
      },
    });
  } else {
    notifee.displayNotification({
      title: title,
      body: body,
      android: {
        actions: [
          {
            title: "test",
            pressAction: {
              id: "mark-as-read",
            },
          },
        ],
        channelId: "default",
      },
    });
  }
};

const App = () => {
  const voximplant = Voximplant.getInstance();
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });
    await messaging().onMessage(onMessageReceived);
  };

  checkNotificationPermission = async () => {};

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then((notification) => {
        console.log("notification click", notification);
        let dataFromNotifivation = {
          ReceiverData: JSON.parse(notification.data.ReceiverData),
          ScreenName: notification.data.ScreenName,
          SenderData: JSON.parse(notification.data.SenderData),
          body: notification.data.body,
          title: notification.data.title,
        };
        console.log("message data ", dataFromNotifivation);
        if (notification.data.ScreenName === "calling") {
          RootNavigation.navigate("SplashScreen", {
            screen: "tabStck",
            userData: dataFromNotifivation.ReceiverData,
          });
        } else if (notification.data.ScreenName === "chatStack") {
          RootNavigation.navigate("SplashScreen", {
            screen: "chatStack",
            userData: dataFromNotifivation.ReceiverData,
          });
        }
      });

    // const settings = notifee.getNotificationSettings();

    // if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {

    // } else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
    //   console.log("Notification permissions has been denied");
    // }
  }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Navigaion />
      </PersistGate>
    </Provider>
  );
};
export default App;
