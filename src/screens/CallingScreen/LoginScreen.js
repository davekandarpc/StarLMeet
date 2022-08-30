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

  const onUserList = async () => {
    try {
      console.log("Hello");
      navigation.navigate("tabStck");
    } catch (err) {
      console.log("Error", err);
    }
  };

  const onChat = async () => {
    try {
      console.log("Hello");
      navigation.navigate("callScreenDemo");
    } catch (err) {
      console.log("Error", err);
    }
  };
  const onCall = async () => {
    try {
      console.log("Hello");
      navigation.navigate("chatStack");
    } catch (err) {
      console.log("Error", err);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        {/* <TextInput
          label="Your ID"
          onChangeText={(text) => setUserId(text)}
          mode="outlined"
          style={styles.input}
        /> */}

        {/* <Button
          mode="contained"
          onPress={onLogin}
          style={styles.btn}
          contentStyle={styles.btnContent}
          disabled={userId.length === 0}
        >
          <Text>Login</Text>
        </Button> */}
        {/* <Text>Login</Text> */}
        <TouchableOpacity onPress={onUserList}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>User List</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onChat}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Chat</Text>
          </View>
        </TouchableOpacity>
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
});
