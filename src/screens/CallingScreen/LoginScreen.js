import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
// import {Text} from 'react-native-paper';
// import { TextInput } from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
// import { Button } from "react-native-paper";
import { colors } from "../../common/colors";
export default function LoginScreen({ props, navigation }) {
  const [userId, setUserId] = useState("");

  const onLogin = async () => {
    try {
      // await AsyncStorage.setItem("userId", userId);
      console.log("Hello");
      navigation.navigate("tabStck");
    } catch (err) {
      console.log("Error", err);
    }
  };

  const onCall = async () => {
    console.log("Hello");
    navigation.navigate("VideoChatStack");
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        {/*  <TouchableOpacity onPress={onLogin}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>user List </Text>
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={onCall}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Call</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#fff",
    flex: 1,
    // alignItems: 'center',
    justifyContent: "center",
  },
  content: {
    // alignSelf: 'center',
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "600",
    borderWidth: 1,
    color: "#000",
  },
  input: {
    height: 60,
    marginBottom: 10,
    color: "#000",
    borderWidth: 1,
  },
  btn: {
    height: 60,
    alignItems: "stretch",
    justifyContent: "center",
    fontSize: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnContent: {
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    color: "red",
  },
  button: {
    marginBottom: 30,
    alignItems: "center",
    backgroundColor: colors.primaryColor,
    marginTop: 45,
    borderRadius: 10,
  },
  buttonText: {
    padding: 20,
    color: "white",
    fontSize: 18,
  },
});
