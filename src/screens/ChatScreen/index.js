import React, { useEffect, useCallback, useState, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Header } from "../../components/HeaderComponent";
import { styles } from "./styles";
import {
  GiftedChat,
  InputToolbar,
  Bubble,
  Send,
  Composer,
} from "react-native-gifted-chat";
import { colors } from "../../common/colors";
import messaging from "@react-native-firebase/messaging";
import { Voximplant } from "react-native-voximplant";
import withUser from "../../redux/HOC/withUser";
import { sendNotification, getMessageList, sendMessage } from "../../utils/API";
import withSelectedRoom from "../../redux/HOC/withSelectedRoom";
import withLoader from "../../redux/HOC/withLoader";
import io from "socket.io-client";
import Icon from "react-native-vector-icons/FontAwesome";

const ChatScreen = ({
  route,
  navigation,
  user,
  selectedRoom,
  loader,
  loaderState,
}) => {
  const voximplant = Voximplant.getInstance();

  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUserName] = useState("");
  const [userName, setUserName] = useState("");

  const [roomID, set_RoomID] = useState("");

  const socketRef = useRef(null);

  useEffect(() => {
    // console.log("Voximplant.ClientEvents.IncomingCall ", );
    voximplant.on(Voximplant.ClientEvents.IncomingCall, (incomingCallEvent) => {
      navigation.navigate("VideoIncomingCallScreen", {
        call: incomingCallEvent.call,
      });
    });

    return () => {
      voximplant.off(Voximplant.ClientEvents.IncomingCall);
    };
  }, []);

  useEffect(() => {
    let roomID;
    if (user.userTypeId === 2) {
      roomID = `Ad${user.id}_${selectedRoom.id}`;
    } else {
      roomID = `${user.id}_${selectedRoom.id}`;
    }
    getMessages(roomID);
  }, [user, selectedRoom]);

  useEffect(() => {
    setSelectedUserName(selectedRoom.userName);
  }, []);

  useEffect(() => {
    // socketRef.current = io('http://192.168.1.48:9000')
    console.log("Message datae ", messages);
    socketRef.current = io.connect("http://212.90.120.175:9000");
    socketRef.current.on("message", ({ message, sid, r_id, time, rid }) => {
      console.log("messages ", { message, sid, r_id, time, rid });
      let msg = {
        text: message,
        user: { _id: sid },
        createdAt: new Date(`${time}`),
        _id: Math.random(1000).toString(),
      };
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, msg)
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [messages]);

  const getMessages = async (roomID) => {
    loader(true);
    const messageResponse = await getMessageList(roomID);
    console.log("rooom Data ", messageResponse);
    const { status, data } = messageResponse;
    if (status === 200) {
      let res = await messageResponse.json();
      set_RoomID(roomID);

      let messages = res.message.replace(/'/g, '"');
      let Objs = JSON.parse(messages);
      let msgList = [];
      for (let i = 0; i < Objs.length; i++) {
        let msg = {
          text: Objs[i].message,
          user: { _id: Objs[i].userid },
          createdAt: new Date(`${Objs[i].date}`),
          _id: Math.random(1000).toString(),
        };

        loader(false);
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, msg)
        );
      }
      // console.log("messages ", msgList);
    } else if (status === 204) {
      loader(false);
      let newRoom = `${selectedRoom.id}_${user.id}`;
      getMessages(newRoom);
    }
  };

  const sendNotification = async (message) => {
    const sendInComingCallRequest = {
      deviceId: `${selectedRoom.fcmToken}`,
      isAndroiodDevice: true,
      title: `${message}`,
      body: `${user.username} message you...`,
    };

    // console.log(
    //   "Starting incoming call ",
    //   JSON.stringify(selectedRoom.fcmToken)
    // );
    const notificationRes = await sendNotification(sendInComingCallRequest);

    console.log(
      "notificationRes incoming call ",
      JSON.stringify(notificationRes)
    );
  };

  const onSend = useCallback(async (messages = [], roomId) => {
    console.log("onSend called ", JSON.stringify(messages));
    let newMessage = {
      senderId: user.id,
      receiverId: selectedRoom.id,
      roomId: roomId,
      message: messages[0].text,
    };
    let sendMessageRes = await sendMessage(newMessage);
    let { status } = sendMessageRes;
    if (status === 200) {
      //sendNotification(messages[0].text);
    }
    socketRef.current.emit("message", {
      message: messages[0].text,
      sid: user.id,
      r_id: selectedRoom.id,
      time: new Date(),
      rid: roomId,
    });
  }, []);

  const callUser = (user) => {
    navigation.navigate("VideoCallingScreen", { user });
  };

  const MessengerBarContainer = (props) => {
    return (
      <InputToolbar {...props} containerStyle={styles.inputToolbarContainer} />
    );
  };

  const customtSendButton = (props) => {
    return (
      <Send {...props}>
        <View
          style={{ justifyContent: "center", height: "100%", marginRight: 10 }}
        >
          <Icon name="send" size={24} color={colors.primaryColor} />
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    const message_sender_id = props.currentMessage.user._id;
    return (
      <Bubble
        {...props}
        position={message_sender_id == user.id ? "right" : "left"}
        wrapperStyle={{
          right: {
            borderBottomRightRadius: 0,
            borderBottomLeftRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            backgroundColor: colors.primaryColor,
          },
          left: {
            borderBottomRightRadius: 15,
            borderBottomLeftRadius: 15,
            borderTopRightRadius: 15,
            borderTopLeftRadius: 0,
            backgroundColor: colors.white,
          },
        }}
      />
    );
  };

  return (
    <View styles={styles.mainContainer}>
      <View style={{ height: "15%" }}>
        <Header
          title={selectedUser}
          subTitle="Er"
          onPressBack={() => {
            navigation.navigate("tabStck");
          }}
          onPressCall={() => {
            let selectedUser = {
              user_name: selectedRoom.userName,
              user_display_name: selectedRoom.userName,
            };
            callUser(selectedUser);
          }}
        />
      </View>

      <View style={{ height: "85%", color: "black" }}>
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages, roomID)}
          renderInputToolbar={(props) => MessengerBarContainer(props)}
          user={{
            _id: user.id,
          }}
          renderSend={(props) => customtSendButton(props)}
          renderBubble={(props) => renderBubble(props)}
          renderComposer={(props) => (
            <Composer
              textInputStyle={{ color: colors.primaryTextColor }}
              {...props}
            />
          )}
        />
        {Platform.OS === "android" && <KeyboardAvoidingView />}
      </View>

      {loaderState && (
        <View style={styles.loaderContainer}>
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primaryColor} />
          </View>
        </View>
      )}
    </View>
  );
};

export default withUser(withSelectedRoom(withLoader(ChatScreen)));
