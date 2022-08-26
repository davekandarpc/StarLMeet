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
import { loginUser } from "../../utils/API";
import withUser from "../../redux/HOC/withUser";
import withLoader from "../../redux/HOC/withLoader";
import { colors } from "../../common/colors";
import Global from "../../components/Global";
import messaging from "@react-native-firebase/messaging";

const LoginScreen = ({ navigation, setUser, loader, loaderState }) => {
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [fcmToken, setFcmToken] = useState("");

  useEffect(() => {
    if (loaderState) {
      loader(false);
    }
  }, [loaderState]);
  useEffect(() => {
    getToken();
  }, []);
  useEffect(() => {
    console.log("token ", fcmToken);
  }, [fcmToken]);

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
      // console.log("Login ", authLogin);
      if (authLogin !== undefined) {
        setUser(authLogin);
        loader(false);
        try {
          await AsyncStorage.setItem("userId", JSON.stringify(authLogin.id));
          await AsyncStorage.setItem(
            "userCallerId",
            JSON.stringify(authLogin.callingId.trim())
          );
          console.log("Hello");
          navigation.navigate("tabStck");
        } catch (err) {
          console.log("Error", err);
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
      <Global />
      {/* {loaderState && (
        <View style={styles.loaderContainer}>
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primaryColor} />
          </View>
        </View>
      )} */}
    </View>
  );
};

export default withUser(withLoader(LoginScreen));
