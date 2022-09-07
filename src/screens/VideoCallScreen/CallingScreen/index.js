import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PermissionsAndroid,
  Alert,
  Platform,
} from "react-native";
import CallActionBox from "../../../components/CallActionBox";
import { sendNotificationAPi } from "../../../utils/API";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/core";
import { Voximplant } from "react-native-voximplant";
import withUser from "../../../redux/HOC/withUser";
import withSelectedRoom from "../../../redux/HOC/withSelectedRoom";

const permissions = [
  PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
  PermissionsAndroid.PERMISSIONS.CAMERA,
];

const CallingScreen = ({ navigation, selectedRoom }) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [callStatus, setCallStatus] = useState("Initializing...");
  const [localVideoStreamId, setLocalVideoStreamId] = useState("");
  const [remoteVideoStreamId, setRemoteVideoStreamId] = useState("");

  // const navigation = useNavigation();
  const route = useRoute();

  const { user, call: incomingCall, isIncomingCall } = route?.params;

  const voximplant = Voximplant.getInstance();

  const call = useRef(incomingCall);
  const endpoint = useRef(null);

  const goBack = () => {
    navigation.pop();
  };

  useEffect(() => {
    const getPermissions = async () => {
      const granted = await PermissionsAndroid.requestMultiple(permissions);
      const recordAudioGranted =
        granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === "granted";
      const cameraGranted =
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] === "granted";
      if (!cameraGranted || !recordAudioGranted) {
        Alert.alert("Permissions not granted");
      } else {
        setPermissionGranted(true);
      }
    };

    if (Platform.OS === "android") {
      getPermissions();
    } else {
      setPermissionGranted(true);
    }
  }, []);

  useEffect(() => {
    if (!permissionGranted) {
      return;
    }

    const callSettings = {
      video: {
        sendVideo: false,
        receiveVideo: false,
      },
      audio: {
        sendAudio: true,
        receiveAudio: true,
      },
    };
    const sendNotification = async (message) => {
      const sendInComingCallRequest = {
        deviceId: `${selectedRoom.fcmToken}`,
        isAndroiodDevice: true,
        title: `${message}`,
        body: `${user.user_name} Call you...`,
        screenName: "calling",
        senderData: JSON.stringify(user),
        receiverData: JSON.stringify(selectedRoom),
      };
      const notificationRes = await sendNotificationAPi(
        sendInComingCallRequest
      );

      console.log(
        "notificationRes incoming call ",
        JSON.stringify(notificationRes)
      );
    };
    const makeCall = async () => {
      call.current = await voximplant.call(user.user_name, callSettings);
      subscribeToCallEvents();
    };

    const answerCall = async () => {
      subscribeToCallEvents();
      endpoint.current = call.current.getEndpoints()[0];
      subscribeToEndpointEvent();
      call.current.answer(callSettings);
    };

    const subscribeToCallEvents = () => {
      call.current.on(Voximplant.CallEvents.Failed, (callEvent) => {
        showError(callEvent.reason);
      });
      call.current.on(Voximplant.CallEvents.MicStatusChange, (callEvent) => {
        console.log("mic status ", callEvent);
      });
      call.current.on(Voximplant.CallEvents.ProgressToneStart, (callEvent) => {
        sendNotification("inComing Calling.......");
        setCallStatus("Calling...");
      });
      call.current.on(Voximplant.CallEvents.Connected, (callEvent) => {
        setCallStatus("Connected");
      });
      call.current.on(Voximplant.CallEvents.Disconnected, (callEvent) => {
        navigation.navigate("chatStack");
      });
      call.current.on(
        Voximplant.CallEvents.LocalVideoStreamAdded,
        (callEvent) => {
          setLocalVideoStreamId(callEvent.videoStream.id);
        }
      );
      call.current.on(Voximplant.CallEvents.EndpointAdded, (callEvent) => {
        endpoint.current = callEvent.endpoint;
        subscribeToEndpointEvent();
      });
    };

    const subscribeToEndpointEvent = async () => {
      endpoint.current.on(
        Voximplant.EndpointEvents.RemoteVideoStreamAdded,
        (endpointEvent) => {
          setRemoteVideoStreamId(endpointEvent.videoStream.id);
        }
      );
    };

    const showError = (reason) => {
      Alert.alert("Call failed", `Reason: ${reason}`, [
        {
          text: "Ok",
          onPress: navigation.navigate("chatStack"),
        },
      ]);
    };

    if (isIncomingCall) {
      answerCall();
    } else {
      makeCall();
    }

    return () => {
      call.current.off(Voximplant.CallEvents.Failed);
      call.current.off(Voximplant.CallEvents.ProgressToneStart);
      call.current.off(Voximplant.CallEvents.Connected);
      call.current.off(Voximplant.CallEvents.Disconnected);
      call.current.off(Voximplant.CallEvents.MicStatusChange);
    };
  }, [permissionGranted]);

  const onHangupPress = () => {
    call.current.hangup();
  };

  const onIsMicOn = (isMicOn) => {
    console.log("hello ", isMicOn);
    // subscribeToCallEvents();
    // call.current.handleMicStatus(isMicOn);
    call.current.sendAudio(!isMicOn);
  };

  /**
 *    <Voximplant.VideoView
        videoStreamId={remoteVideoStreamId}
        style={styles.remoteVideo}
      />

      <Voximplant.VideoView
        videoStreamId={localVideoStreamId}
        style={styles.localVideo}
      />
 */
  return (
    <View style={styles.page}>
      <Pressable onPress={goBack} style={styles.backButton}>
        <Ionicons name="chevron-back" color="white" size={25} />
      </Pressable>

      <View style={styles.cameraPreview}>
        <Text style={styles.name}>{user?.user_display_name}</Text>
        <Text style={styles.phoneNumber}>{callStatus}</Text>
      </View>

      <CallActionBox
        onHangupPress={onHangupPress}
        onMicePress={(isMicOn) => {
          onIsMicOn(isMicOn);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: {
    height: "100%",
    backgroundColor: "#7b4e80",
  },
  cameraPreview: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  localVideo: {
    width: 100,
    height: 150,
    backgroundColor: "#ffff6e",

    borderRadius: 10,

    position: "absolute",
    right: 10,
    top: 100,
  },
  remoteVideo: {
    backgroundColor: "#7b4e80",
    borderRadius: 10,
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 100,
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
    marginTop: 50,
    marginBottom: 15,
  },
  phoneNumber: {
    fontSize: 20,
    color: "white",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 10,
    zIndex: 10,
  },
});

export default withSelectedRoom(withUser(CallingScreen));