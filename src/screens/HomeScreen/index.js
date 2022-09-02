import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";
import { SearchBar } from "../../components/SearchBarComponent";
import { ListItem } from "../../components/ListItemComponent";
import AsyncStorage from "@react-native-community/async-storage";
import { userList } from "../../utils/API";
import withUser from "../../redux/HOC/withUser";
import withSelectedRoom from "../../redux/HOC/withSelectedRoom";

const contactData = [
  {
    id: 1,
    image: "",
    userName: "Momin",
    description: "Abc",
    is_active: true,
  },
  {
    id: 2,
    image: "",
    userName: "Kandarp",
    description: "EFG",
    is_active: true,
  },
];

const HomeScreen = ({ navigation, user, setSelectedRoom }) => {
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState("");
  const [contactList, setContactList] = useState([]);
  const [searchList, setSearchList] = useState([]);

  const getUserList = async () => {
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
        fcmToken: userListRes[i].fcmToken.trim(),
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
  useEffect(() => {
    AsyncStorage.getItem("userId").then((id) => {
      setUserName(user.id);
    });
    //console.log("Login user ", user);
    getUserList();
  }, []);

  useEffect(() => {
    ////console.log("USer list ", contactList);
    console.log("USer userName ", user.id);
  }, [contactList, userName]);

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
