import React, { useState, useEffect } from "react";
import { ImageBackground } from "react-native";
import { styles } from "./styles";
import withUser from "../../redux/HOC/withUser";
import withLoader from "../../redux/HOC/withLoader";

const SplashScreen = ({ navigation, loader, loaderState }) => {
  useEffect(() => {
    if (loaderState) {
      loader(false);
    }
  }, [loaderState]);
  useEffect(() => {
    let timeout;
    timeout = setTimeout(() => {
      // navigation.navigate("callScreenLoginDemo");
      navigation.navigate("Music");
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <ImageBackground
      source={require("../../assest/slmeetback.png")}
      style={{ width: "100%", height: "100%" }}
    ></ImageBackground>
  );
};

export default withUser(withLoader(SplashScreen));
