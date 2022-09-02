import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles";
import AsyncStorage from "@react-native-community/async-storage";
import { loginUser, getVoxUser, createVoxUser } from "../../utils/API";
import withUser from "../../redux/HOC/withUser";
import withLoader from "../../redux/HOC/withLoader";
import { colors } from "../../common/colors";
import Global from "../../components/Global";
import messaging from "@react-native-firebase/messaging";
import { Voximplant } from "react-native-voximplant";
import { APP_NAME, ACC_NAME } from "../../Constants";
const LoginScreen = ({ navigation, setUser, loader, loaderState }) => {
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [fcmToken, setFcmToken] = useState("");
  const [voxStatus, setStatus] = useState("");

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
    getToken();
  }, []);
  useEffect(() => {
    console.log("token ", fcmToken);
  }, [fcmToken]);

  const creatVox_User = async (req) => {
    const user = await createVoxUser(req);
    return user.status;
  };

  const getToken = async () => {
    await messaging().registerDeviceForRemoteMessages();
    const token = await messaging().getToken();
    setFcmToken(token);
  };

  const login = async () => {
    loader(true);

    if (userName != "" && password != "") {
      const loginFormData = {
        userName,
        password,
        token: fcmToken,
      };
      const authLogin = await loginUser(loginFormData);
      console.log("Login ", authLogin);
      const { status } = authLogin;
      if (authLogin !== undefined) {
        if (status === 200) {
          const loginRes = await authLogin.json();
          setUser(loginRes);
          let voxUser = await getVoxUser(userName);
          let withjson = await voxUser.json();
          const { result } = withjson;
          if (result.length > 0) {
            console.log("do login", result);
            console.log("do userName ", userName, password);
            try {
              const fqUsername = `${userName}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
              let authres = await voximplant.login(fqUsername, password);
              console.log(" authres ", authres);
              loader(false);
              navigation.navigate("tabStck");
            } catch (err) {
              console.log("Error", err);
            }
          } else {
            console.log("do add user in vox");
            const loginForVoxData = {
              userId: userName,
              pass: password,
              displayName: userName,
            };
            const create_vox = await creatVox_User(loginForVoxData);
            console.log(create_vox);
            if (create_vox === 200) {
              try {
                const fqUsername = `${userName}@${APP_NAME}.${ACC_NAME}.voximplant.com`;
                let authres = await voximplant.login(fqUsername, password);
                console.log(" authres ", authres);
                loader(false);
                navigation.navigate("tabStck");
              } catch (err) {
                console.log("Error", err);
              }
            }
          }
        }
      }
    } else {
      alert("Please fill user name");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <TextInput
        style={styles.textInputContainer}
        onChangeText={(text) => setuserName(text)}
        placeholder="UserName"
        value={userName}
      />
      <TextInput
        style={styles.textInputContainer}
        onChangeText={(text) => setPassword(text)}
        placeholder="password"
        value={password}
        secureTextEntry={true}
      />
      <TouchableOpacity onPress={login}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </View>
      </TouchableOpacity>
      {loaderState && (
        <View style={styles.loaderContainer}>
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primaryColor} />
          </View>
        </View>
      )}
    </View>
  );
};

export default withUser(withLoader(LoginScreen));
