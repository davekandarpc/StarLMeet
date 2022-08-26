import React, { useState } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import { styles } from "./styles";
import { colors } from "../../common/colors";

export const Header = ({ title, subTitle, onPressBack, onPressCall }) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.iconContainer} onPress={onPressBack}>
        <Icon name="arrow-left" size={20} color={colors.black} />
      </TouchableOpacity>
      <View
        style={{ flex: 4, justifyContent: "center", flexDirection: "column" }}
      >
        <Text style={{ color: colors.black }}>{title}</Text>
        <View style={styles.subTextContainer}>
          <View style={styles.active} />
          <Text style={styles.subTextStyle}>{subTitle}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.iconContainer} onPress={onPressCall}>
        <MaterialIcon name="call" size={40} color={colors.black} />
      </TouchableOpacity>
    </View>
  );
};
