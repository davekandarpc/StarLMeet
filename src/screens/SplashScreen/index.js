import React, { useState, useEffect } from "react";
import { ImageBackground } from "react-native";
import { styles } from "./styles";
import withUser from "../../redux/HOC/withUser";
import withLoader from "../../redux/HOC/withLoader";
import { loginUser, getVoxUser, createVoxUser } from "../../utils/API";
import { Voximplant } from "react-native-voximplant";
import { APP_NAME, ACC_NAME } from "../../Constants";

const SplashScreen = ({ navigation, loader, loaderState, route, setUser }) => {
  const [voxStatus, setStatus] = useState("");
  const [Authres, setAuthres] = useState(null);

  const voximplant = Voximplant.getInstance();
  useEffect(() => {
    const connect = async () => {
      const status = await voximplant.getClientState();

      if (status === Voximplant.ClientState.DISCONNECTED) {
        await voximplant.connect();
      } else if (status === Voximplant.ClientState.LOGGED_IN) {
        await voximplant.disconnect();
      }
      console.log("status ", status);
      setStatus(status);
    };
    connect();
  }, [voxStatus]);
  useEffect(() => {
    if (loaderState) {
      loader(false);
    }
  }, [loaderState]);

  useEffect(() => {
    console.log(
      "voximplant IncomingCall",
      Voximplant.ClientEvents.IncomingCall
    );
    // voximplant.on(Voximplant.CallEvents.Failed, (callEvent) => {
    //   console.log("callEvent callEvent", callEvent);
    // });
    voximplant.on(Voximplant.ClientEvents.IncomingCall, (incomingCallEvent) => {
      console.log("voximplant IncomingCall", incomingCallEvent);
      navigation.navigate("VideoIncomingCallScreen", {
        call: incomingCallEvent.call,
      });
    });

    return () => {
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
      voximplant.off(Voximplant.CallEvents.Failed);
    };
  }, [Authres]);

  useEffect(() => {
    let timeout;
    timeout = setTimeout(() => {
      console.log("route ", route.params);
      if (route?.params?.screen === "chatStack") {
        loginUserData(route?.params?.userData, "chatStack");
      } else if (route?.params?.screen === "tabStck") {
        loginUserData(route?.params?.userData, "tabStck");
      } else {
        navigation.navigate("Music");
      }
    }, 3000);
    console.log("route 002", route);
    return () => {
      clearTimeout(timeout);
    };
  }, [route]);

  const creatVox_User = async (req) => {
    const user = await createVoxUser(req);
    return user.status;
  };

  const loginUserData = async (data, screen) => {
    const loginFormData = {
      userName: data.userName,
      password: data.password,
      token: data.fcmToken,
    };
    const authLogin = await loginUser(loginFormData);
    console.log("Login ", authLogin);
    const { status } = authLogin;
    if (authLogin !== undefined) {
      if (status === 200) {
        const loginRes = await authLogin.json();

        console.log("ij ", loginRes);
        setUser(loginRes);
        let voxUser = await getVoxUser(data.userName);
        let withjson = await voxUser.json();
        const { result } = withjson;
        if (result.length > 0) {
          console.log("do login", result);
          console.log("do userName ", data.userName, data.password);
          try {
            const fqUsername = `${data.userName}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
            let authres = await voximplant.login(fqUsername, data.password);
            console.log(" authres ", authres);
            setAuthres(authres);
            loader(false);
            if (screen !== "") {
              navigation.navigate(screen);
            }
          } catch (err) {
            console.log("Error", err);
          }
        } else {
          console.log("do add user in vox");
          const loginForVoxData = {
            userId: data.userName,
            pass: data.password,
            displayName: data.userName,
          };
          const create_vox = await creatVox_User(loginForVoxData);
          console.log(create_vox);
          if (create_vox === 200) {
            try {
              const fqUsername = `${data.userName}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
              let authres = await voximplant.login(fqUsername, data.password);
              console.log(" authres ", authres);
              loader(false);
              if (screen !== "") {
                navigation.navigate(screen);
              }
            } catch (err) {
              console.log("Error", err);
            }
          }
        }
      } else if (status === 500) {
        loader(false);
        const dataError = await authLogin.text();
        console.log("dataError: ", typeof dataError);
        alert("User not found. Please enter correct credentials.");
      }
    }
  };

  return (
    <ImageBackground
      source={require("../../assest/slmeetback.png")}
      style={{ width: "100%", height: "100%" }}
    ></ImageBackground>
  );
};

export default withUser(withLoader(SplashScreen));
