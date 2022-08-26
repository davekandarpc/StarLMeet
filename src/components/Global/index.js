import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { styles } from "./styles";
import { colors } from "../../common/colors";
import withLoader from "../../redux/HOC/withLoader";

const Global = ({ loaderState }) => {
  useEffect(() => {
    console.log("loaderState ", loaderState);
  }, [loaderState]);
  return (
    <>
      {loaderState && (
        <View style={styles.loaderContainer}>
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primaryColor} />
          </View>
        </View>
      )}
    </>
  );
};

export default withLoader(Global);
