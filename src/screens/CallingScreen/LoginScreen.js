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

export default function LoginScreen({ props, navigation }) {
  const [userId, setUserId] = useState("");

  const onLogin = async () => {
    try {
      await AsyncStorage.setItem("userId", userId);
      console.log("Hello");
      navigation.navigate("callScreenDemo");
    } catch (err) {
      console.log("Error", err);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <Text style={styles.heading}>Enter your id</Text>
        <TextInput
          label="Your ID"
          onChangeText={(text) => setUserId(text)}
          mode="outlined"
          style={styles.input}
        />

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
        <TouchableOpacity onPress={onLogin}>
          <View style={styles.btn}>
            <Text style={styles.btnContent}>Demo Login</Text>
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
});
