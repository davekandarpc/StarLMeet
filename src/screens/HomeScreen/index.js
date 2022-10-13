import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";
import { Voximplant } from "react-native-voximplant";
import { SearchBar } from "../../components/SearchBarComponent";
import { ListItem } from "../../components/ListItemComponent";
import AsyncStorage from "@react-native-community/async-storage";
import { userList } from "../../utils/API";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import withUser from "../../redux/HOC/withUser";
import withSelectedRoom from "../../redux/HOC/withSelectedRoom";

const HomeScreen = ({ navigation, user, setSelectedRoom }) => {
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [contactList, setContactList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const voximplant = Voximplant.getInstance();

  const getUserList = async () => {
    console.log("Data: " + JSON.stringify(user.id));
    const userListRes = await userList(user.id);
    //console.log("Data: " + JSON.stringify(userListRes));
    let userListDat = [];
    for (let i = 0; i < userListRes.length; i++) {
      let data = {
        id: userListRes[i].id,
        callingId: userListRes[i].callingId.trim(),
        adminId: userListRes[i].adminId,
        userName: userListRes[i].userName.trim(),
        password: userListRes[i].password.trim(),
        description: userListRes[i].description.trim(),
        mobile: userListRes[i].mobile.trim(),
        fcmToken: userListRes[i].fcmToken,
        status: userListRes[i].status,
        userTypeId: userListRes[i].userTypeId,
        createdAt: userListRes[i].createdAt,
      };
      userListDat.push(data);
    }
    //console.log("push datya ", userListDat);
    setContactList(userListDat);
    setSearchList(userListDat);
  };

  // useEffect(() => {
  //   AsyncStorage.getItem("userId").then((id) => {
  //     setUserName(user.id);
  //   });
  //   console.log("Login user ", JSON.stringify(user));
  //   getUserList();
  // }, []);

  const searchTerm = () => {
    const result = searchList.filter((value) => {
      if (value.userName.includes(search.toLowerCase())) {
        return value;
      } else if (search === "") {
        return value;
      }
    });
    setContactList(result);
  };
  const isFocused = useIsFocused();
  useFocusEffect(
    useCallback(() => {
      console.log("naviagate useFocusEffect ");
      AsyncStorage.getItem("userId").then((id) => {
        setUserName(user.id);
      });
      console.log("Login user ", JSON.stringify(user));
      getUserList();
      voximplant.on(
        Voximplant.ClientEvents.IncomingCall,
        (incomingCallEvent) => {
          console.log("voximplant IncomingCall", incomingCallEvent);
          navigation.navigate("VideoIncomingCallScreen", {
            call: incomingCallEvent.call,
          });
        }
      );

      return () => {
        voximplant.off(Voximplant.ClientEvents.IncomingCall);
      };
    }, [])
  );
  // useEffect(() => {
  //   console.log("voximplant IncomingCall", voximplant);

  //   if (isFocused) {
  //     console.log("naviagate back");
  //   }
  //   voximplant.on(Voximplant.ClientEvents.IncomingCall, (incomingCallEvent) => {
  //     console.log("voximplant IncomingCall", incomingCallEvent);
  //     navigation.navigate("VideoIncomingCallScreen", {
  //       call: incomingCallEvent.call,
  //     });
  //   });

  //   return () => {
  //     voximplant.off(Voximplant.ClientEvents.IncomingCall);
  //   };
  // }, []);
  useEffect(() => {
    searchTerm();
  }, [search]);

  const onClickItem = async (selectedItem) => {
    try {
      setSelectedRoom(selectedItem);
      navigation.navigate("chatStack");
    } catch (err) {
      //console.log("Error", err);
    }
  };
  const renderItem = ({ item }) => {
    if (item?.id !== parseInt(userName)) {
      return (
        <ListItem
          data={item}
          onPressItem={(selectedData) => {
            onClickItem(selectedData);
          }}
        />
      );
    } else {
      //console.log("else", item?.id !== userName.trim());
    }
  };

  return (
    <View style={styles.mainContainer}>
      <SearchBar
        onGetText={(data) => {
          setSearch(data);
        }}
      />
      <FlatList
        style={{ marginTop: 25 }}
        keyExtractor={(item, index) => index}
        data={contactList}
        renderItem={renderItem}
      />
    </View>
  );
};

export default withUser(withSelectedRoom(HomeScreen));
