import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
// import { Text } from "react-native-paper";
// import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
// import { TextInput } from "react-native-paper";

import { useFocusEffect } from "@react-navigation/native";

import InCallManager from "react-native-incall-manager";
import Modal from "react-native-modal";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/FontAwesome";

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from "react-native-webrtc";
// import {acc} from 'react-native-reanimated';

const STUN_SERVER = "stun:webrtc.skyrockets.space:3478";
const SOCKET_URL = "wss://webrtc.skyrockets.space:8080";

export default function CallScreen({ navigation, ...props }) {
  const [userId, setUserId] = useState("");
  const [socketActive, setSocketActive] = useState(false);
  const [calling, setCalling] = useState(false);
  const [localStream, setLocalStream] = useState({ toURL: () => null });
  const [remoteStream, setRemoteStream] = useState({ toURL: () => null });

  const conn = useRef(new WebSocket(SOCKET_URL));

  const yourConn = useRef(
    new RTCPeerConnection({
      iceServers: [
        {
          urls: STUN_SERVER,
        },
      ],
    })
  );

  const [callActive, setCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [otherId, setOtherId] = useState("");
  const [callToUsername, setCallToUsername] = useState("");
  const [onername, setOnername] = useState("");
  const [ReceiverName, setReceiverName] = useState("");
  const [selectedUser, setSelectedUserName] = useState("");
  const connectedUser = useRef(null);
  const offerRef = useRef(null);

  useEffect(() => {
    AsyncStorage.getItem("userId").then((id) => {
      setOnername(id);
    });
    AsyncStorage.getItem("sendTo").then((id) => {
      setSelectedUserName(id);
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem("userId").then((id) => {
        console.log("id ", id);
        if (id) {
          setUserId(id);
        } else {
          setUserId("");
          navigation.push("Login");
        }
      });
    }, [userId])
  );

  useEffect(() => {
    navigation.setOptions({
      title: "Your ID - " + userId,
      headerRight: () => (
        <TouchableOpacity
          mode="text"
          onPress={onLogout}
          style={{ paddingRight: 10 }}
        >
          <Text> Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [userId]);

  /**
   * Calling Stuff
   */

  useEffect(() => {
    if (socketActive && userId.length > 0) {
      try {
        InCallManager.start({ media: "audio" });
        InCallManager.setForceSpeakerphoneOn(true);
        InCallManager.setSpeakerphoneOn(true);
      } catch (err) {
        console.log("InApp Caller ---------------------->", err);
      }

      send({
        type: "login",
        name: userId,
      });
    }
  }, [socketActive, userId]);

  const onLogin = () => {};

  useEffect(() => {
    /**
     *
     * Sockets Signalling
     */
    conn.current.onopen = () => {
      console.log("Connected to the signaling server");
      setSocketActive(true);
    };
    //when we got a message from a signaling server
    conn.current.onmessage = (msg) => {
      console.log("msg --------------------->", msg);

      const data = JSON.parse(msg.data);
      console.log("Data --------------------->", data);
      switch (data.type) {
        case "login":
          console.log("Login dat");
          break;
        //when somebody wants to call us
        case "offer":
          handleOffer(data.offer, data.name);
          console.log("Offer : ", data.offer, data.name);
          break;
        case "answer":
          handleAnswer(data.answer);
          console.log("Answer");
          break;
        //when a remote peer sends an ice candidate to us
        case "candidate":
          handleCandidate(data.candidate);
          console.log("Candidate");
          break;
        case "leave":
          handleLeave();
          console.log("Leave");
          break;
        default:
          break;
      }
    };
    conn.current.onerror = function (err) {
      console.log("Got error", err);
    };
    initLocalVideo();
    registerPeerEvents();
  }, []);

  useEffect(() => {
    if (!callActive) {
      InCallManager.stop();
    } else {
      InCallManager.setSpeakerphoneOn(true);
    }
  }, [callActive]);

  const registerPeerEvents = () => {
    yourConn.current.onaddstream = (event) => {
      console.log("On Add Remote Stream");
      setRemoteStream(event.stream);
    };

    // Setup ice handling
    yourConn.current.onicecandidate = (event) => {
      if (event.candidate) {
        send({
          type: "candidate",
          candidate: event.candidate,
        });
      }
    };
  };

  const initLocalVideo = () => {
    // let isFront = false;
    // mediaDevices.enumerateDevices().then(sourceInfos => {
    //   let videoSourceId;
    //   for (let i = 0; i < sourceInfos.length; i++) {
    //     const sourceInfo = sourceInfos[i];
    //     if (
    //       sourceInfo.kind == 'videoinput' &&
    //       sourceInfo.facing == (isFront ? 'front' : 'environment')
    //     ) {
    //       videoSourceId = sourceInfo.deviceId;
    //     }
    //   }
    mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          mandatory: {
            minWidth: 500, // Provide your own width, height and frame rate here
            minHeight: 300,
            minFrameRate: 30,
          },
          facingMode: "user",
          // optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
        },
      })
      .then((stream) => {
        // Got stream!
        setLocalStream(stream);
        stream.getVideoTracks()[0].stop();
        // setup stream listening
        yourConn.current.addStream(stream);
      })
      .catch((error) => {
        // Log error
      });
    // });
  };

  const send = (message) => {
    //attach the other peer username to our messages
    console.log(
      "connectedUser.current iser in end----------",
      connectedUser.current
    );
    if (connectedUser.current) {
      message.name = connectedUser.current;
      // console.log("Connected iser in end----------", message);
    }
    console.log("Message", message);
    conn.current.send(JSON.stringify(message));
  };

  const onCall = () => {
    sendCall(callToUsername);
    setReceiverName(callToUsername);
    console.log("her ", callToUsername);
    setTimeout(() => {
      sendCall(callToUsername);
    }, 1000);
  };

  const sendCall = (receiverId) => {
    setCalling(true);
    const otherUser = receiverId;
    connectedUser.current = otherUser;
    console.log("Caling to", otherUser);
    // create an offer
    yourConn.current.createOffer().then((offer) => {
      yourConn.current.setLocalDescription(offer).then(() => {
        console.log("Sending Ofer", offer);
        // console.log(offer);
        send({
          type: "offer",
          offer: offer,
        });
        // Send pc.localDescription to peer
      });
    });
  };

  //when somebody sends us an offer
  const handleOffer = async (offer, name) => {
    console.log(name + " is calling you.");
    connectedUser.current = name;
    offerRef.current = { name, offer };
    setIncomingCall(true);
    setOtherId(name);
    // acceptCall();
    if (callActive) acceptCall();
  };

  const acceptCall = async () => {
    const name = offerRef.current.name;
    const offer = offerRef.current.offer;
    setIncomingCall(false);
    setCallActive(true);
    console.log("Accepting CALL", name, offer);
    yourConn.current
      .setRemoteDescription(offer)
      .then(function () {
        connectedUser.current = name;
        return yourConn.current.createAnswer();
      })
      .then(function (answer) {
        yourConn.current.setLocalDescription(answer);
        send({
          type: "answer",
          answer: answer,
        });
      })
      .then(function () {
        // Send the answer to the remote peer using the signaling server
      })
      .catch((err) => {
        console.log("Error acessing camera", err);
      });

    // try {
    //   await yourConn.setRemoteDescription(new RTCSessionDescription(offer));

    //   const answer = await yourConn.createAnswer();

    //   await yourConn.setLocalDescription(answer);
    //   send({
    //     type: 'answer',
    //     answer: answer,
    //   });
    // } catch (err) {
    //   console.log('Offerr Error', err);
    // }
  };

  //when we got an answer from a remote user
  const handleAnswer = (answer) => {
    setCalling(false);
    setCallActive(true);
    yourConn.current.setRemoteDescription(new RTCSessionDescription(answer));
  };

  //when we got an ice candidate from a remote user
  const handleCandidate = (candidate) => {
    setCalling(false);
    // console.log('Candidate ----------------->', candidate);
    yourConn.current.addIceCandidate(new RTCIceCandidate(candidate));
  };

  //hang up
  // const hangUp = () => {
  //   send({
  //     type: 'leave',
  //   });

  //   handleLeave();
  // };

  // const handleLeave = () => {
  //   connectedUser.current = null;
  //   setRemoteStream({toURL: () => null});

  //   // yourConn.close();
  //   // yourConn.onicecandidate = null;
  //   // yourConn.onaddstream = null;
  // };

  const onLogout = () => {
    // hangUp();

    handleLeave();

    AsyncStorage.removeItem("userId").then((res) => {
      navigation.push("Login");
    });
  };

  const rejectCall = async () => {
    send({
      type: "leave",
    });
    // ``;
    // setOffer(null);

    // handleLeave();
  };

  const handleLeave = () => {
    send({
      name: userId,
      otherName: otherId,
      type: "leave",
    });
    setCalling(false);
    setIncomingCall(false);
    setCallActive(false);
    offerRef.current = null;
    connectedUser.current = null;
    setRemoteStream(null);
    setLocalStream(null);
    yourConn.current.onicecandidate = null;
    yourConn.current.ontrack = null;

    resetPeer();
    initLocalVideo();
    // console.log("Onleave");
  };

  const resetPeer = () => {
    yourConn.current = new RTCPeerConnection({
      iceServers: [
        {
          urls: STUN_SERVER,
        },
      ],
    });

    registerPeerEvents();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.mainContainer}>
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <View
          style={{ flex: 4, justifyContent: "center", flexDirection: "column" }}
        >
          <Text style={{ color: "black" }}>wel come</Text>

          <Text style={styles.subTextStyle}>{onername}</Text>
        </View>
      </View>
      <View style={styles.inputField}>
        <Text style={styles.textColor}>Enter the number</Text>
        <TextInput
          label="Enter Friends Id"
          mode="outlined"
          style={styles.input}
          onChangeText={(text) => setCallToUsername(text)}
        />
        <Text style={styles.textColor}>
          SOCKET ACTIVE:{socketActive ? "TRUE" : "FASLE"}, FRIEND ID:
          {callToUsername || otherId}
        </Text>
      </View>
      <View style={styles.maincallbtndiv}>
        <View style={styles.callnamebtn}>
          <Text style={styles.callnamebtnText}>
            {ReceiverName.substring(0)}
          </Text>
        </View>
      </View>
      <View style={styles.bottomCenter}>
        <TouchableOpacity onPress={onCall}>
          <View style={styles.callbuton}>
            <MaterialIcon name="call" size={40} />
          </View>
        </TouchableOpacity>
      </View>
      {/* <Text>Wel Come {onername}</Text> */}
      <Modal isVisible={incomingCall && !callActive}>
        <View
          style={{
            backgroundColor: "white",
            padding: 22,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
            borderColor: "rgba(0, 0, 0, 0.1)",
          }}
        >
          <TouchableOpacity style={styles.btnContent} onPress={acceptCall}>
            <Text style={styles.textColor}>Accept Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnContent} onPress={handleLeave}>
            <Text style={styles.textColor}>Reject Call </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>

    // <View style={styles.root}>
    //   <View style={styles.inputField}>
    //     <Text style={styles.textColor}>Enter the number</Text>
    //     <TextInput
    //       label="Enter Friends Id"
    //       mode="outlined"
    //       style={styles.input}
    //       onChangeText={(text) => setCallToUsername(text)}
    //     />
    //     <Text style={styles.textColor}>
    //       SOCKET ACTIVE:{socketActive ? "TRUE" : "FASLE"}, FRIEND ID:
    //       {callToUsername || otherId}
    //     </Text>
    //     {/* <TouchableOpacity
    //       onPress={onCall}
    //       style={styles.btnContent}
    //       // disabled={!socketActive || callToUsername === "" || callActive}
    //     >
    //       <Text style={styles.textColor}> Call</Text>
    //     </TouchableOpacity> */}
    //     {/* <TouchableOpacity
    //       // mode="contained"
    //       onPress={handleLeave}
    //       style={styles.btnContent}
    //       // disabled={!callActive}
    //     >
    //       <Text style={styles.textColor}> End Call</Text>
    //     </TouchableOpacity> */}
    //   </View>
    //   <View style={styles.maincallbtndiv}>
    //     <TouchableOpacity>
    //       <View style={styles.callbuton}>
    //         <MaterialIcon name="call" size={40} />
    //       </View>
    //     </TouchableOpacity>
    //   </View>

    //   <Text style={styles.textColor}>{otherId + " is calling you"}</Text>
    // </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 20,
  },
  inputField: {
    marginBottom: 10,
    flexDirection: "column",
    paddingHorizontal: 20,
  },
  videoContainer: {
    flex: 1,
    minHeight: 450,
    borderWidth: 1,
  },
  videos: {
    width: "100%",
    flex: 1,
    position: "relative",
    overflow: "hidden",

    borderRadius: 6,
  },
  localVideos: {
    height: 100,
    marginBottom: 10,
  },
  remoteVideos: {
    height: 400,
  },
  localVideo: {
    backgroundColor: "#f2f2f2",
    height: "100%",
    width: "100%",
  },
  remoteVideo: {
    backgroundColor: "#f2f2f2",
    height: "100%",
    width: "100%",
  },
  textColor: {
    color: "#000",
  },
  btnContent: {
    alignItems: "center",
    backgroundColor: "orange",
    marginTop: 5,
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    border: 1,
  },
  input: {
    height: 50,
    marginBottom: 10,
    color: "#000",
    borderWidth: 1,
    marginTop: 10,
  },
  callbuton: {
    backgroundColor: "#4CAF50",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
  },
  maincallbtndiv: {
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomCenter: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 30,
    alignItems: "center",
  },
  callnamebtn: {
    backgroundColor: "#e7e7e7",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 100,
  },
  callnamebtnText: {
    fontSize: 20,
    color: "#000",
  },
  mainContainer: {
    height: 70,
    flexDirection: "row",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 3,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  iconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  subTextContainer: {
    marginTop: 4,
    borderWidth: 0,
    width: "85%",
    flexDirection: "row",
  },
  subTextStyle: {
    color: "gray",
    fontSize: 12,
    marginLeft: 5,
  },
  active: {
    height: 15,
    backgroundColor: "gray",
    borderWidth: 0,
    width: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
  inActive: {
    height: 15,
    backgroundColor: "gray",
    borderWidth: 0,
    width: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
  },
});
