import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  TextInput,
  FlatList,
} from "react-native";
import FastImage from "react-native-fast-image";
import { styles } from "./styles";
export const ListItem = ({ data, onPressItem }) => {
  const onClickItem = (data) => {
    onPressItem(data);
  };

  return (
    <TouchableOpacity
      style={styles.itemCardContainer}
      onPress={() => {
        onClickItem(data);
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={styles.subCardView}>
          <FastImage
            style={styles.imageStyle}
            source={{
              uri: "https://unsplash.it/400/400?image=1",
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.textStyle}>{data.userName}</Text>
          <View style={styles.subTextContainer}>
            <Text style={styles.subTextStyle}>{data.description}</Text>
          </View>
        </View>
      </View>
      <View style={data.is_active === true ? styles.active : styles.inActive} />
    </TouchableOpacity>
  );
};
